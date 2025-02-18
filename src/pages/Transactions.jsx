import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');


  const storedTheme = localStorage.getItem('theme') || 'light';
const theme = storedTheme;
  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);

    useEffect(() => {
      if (!token || role !== "user") {
        navigate("/login");
        return;
      }
    }, [token, role, navigate]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`https://newly-bright-chigger.ngrok-free.app/api/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions);  
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [userId]);  
  const groupByDate = (transactions) => {
    return transactions.reduce((groups, transaction) => {
      const date = new Date(transaction.date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {});
  };

  const groupedTransactions = groupByDate(transactions);

  return (
    <Container  className="py-4">
  <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Transactions</h2>
  </div>
      {transactions.length === 0 ? (
        <p>No transactions found for this user.</p>
      ) : (
        Object.keys(groupedTransactions).map((date, index) => (
          <div key={index}>
            <h5 className="text-muted mt-3">{date}</h5>
            <Card className="mt-2 mb-4">
              <Card.Body>
                {groupedTransactions[date].map((transaction, idx) => {
                  const transactionDate = new Date(transaction.date);
                  const formattedTime = transactionDate.toLocaleTimeString();

                  return (
                    <Row
                      key={idx}
                      className="py-2 align-items-center"
                      style={{
                        borderBottom: '1px solid #f1f1f1',
                      }}
                    >
                      <Col xs={8} className="text-start">
                        <strong>{transaction.type === 'deposit' ? 'Deposit' : 'Withdrawal'}</strong>
                        <p>{transaction.description}</p>
                        <small className="text-muted">{formattedTime}</small>
                      </Col>
                      <Col xs={4} className="text-end">
                        <span
                          style={{
                            color: transaction.type === 'deposit' ? '#11864E' : '#e74c3c',
                            fontWeight: 'bold',
                          }}
                        >
                          {transaction.type === 'withdrawal'
                            ? `-$${Math.abs(transaction.amount)}`
                            : `+$${transaction.amount}`}
                        </span>
                      </Col>
                    </Row>
                  );
                })}
              </Card.Body>
            </Card>
          </div>
        ))
      )}
    </Container>
  );
};

export default Transactions;
