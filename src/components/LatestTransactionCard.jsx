import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const LatestTransactionCard = () => {
  const [latestTransaction, setLatestTransaction] = useState(null);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId'); 

  useEffect(() => {
    const fetchLatestTransaction = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/transactions/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        const transactions = data.transactions;
        
        if (transactions && transactions.length > 0) {
          setLatestTransaction(transactions[0]);
        } else {
          console.error('No transactions found for user:', userId);
          setError('No transactions available');
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
        setError('Error fetching transactions');
      }
    };

    fetchLatestTransaction();
  }, [userId]);

  return (
    <Card className="mb-3" style={{ border: '1px solid #d1d1d1', borderRadius: '10px', backgroundColor: '#f9f9f9' }}>
      <Card.Body>
        {error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : latestTransaction ? (
          <Row>
            <Col xs={8}>
              <h6 style={{ color: '#000000', fontWeight: '600' }}>
                {latestTransaction.type || 'Transaction'}
              </h6>
              <p style={{ fontSize: '12px', color: '#888888', marginBottom: '8px' }}>
                {new Date(latestTransaction.date).toLocaleDateString()} {new Date(latestTransaction.date).toLocaleTimeString()}
              </p>
            </Col>
            <Col xs={4} className="text-end">
              <p
                style={{
                  color: latestTransaction.type === 'deposit' ? '#28a745' : '#e74c3c',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  marginBottom: '0',
                }}
              >
                {latestTransaction.type === 'withdrawal'
                  ? `-${latestTransaction.amount}`
                  : `+${latestTransaction.amount}`}
              </p>
            </Col>
          </Row>
        ) : (
          <p>Loading latest transaction...</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default LatestTransactionCard;
