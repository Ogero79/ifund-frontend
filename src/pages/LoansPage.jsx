import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Table,
  Alert,
  Modal,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import axios from "axios"; 

const LoansPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const [loanDetails, setLoanDetails] = useState({
    amount: "",
    duration: "",
    purpose: "",
  });
  const [loanHistory, setLoanHistory] = useState([]);
  const [loanLimit, setLoanLimit] = useState(0);
  const [repaymentInfo, setRepaymentInfo] = useState({
    amount: 0,
    dueDate: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showRepaymentModal, setShowRepaymentModal] = useState(false);
  const [activeLoan, setActiveLoan] = useState(null);
  const [repaymentAmount, setRepaymentAmount] = useState("");
  const [outstandingLoanAmount, setOutstandingLoanAmount] = useState("");
    const [balance, setBalance] = useState(null); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoanDetails({ ...loanDetails, [name]: value });
    setErrorMessage("");
    if (name === "duration") updateRepaymentInfo(value, loanDetails.amount);
  };

  const updateRepaymentInfo = (duration, amount) => {
    const now = new Date();
    let interestRate = 0;
    let repaymentDate = new Date();

    if (duration.includes("days")) {
      const days = parseInt(duration);
      repaymentDate.setDate(now.getDate() + days);
      interestRate = days <= 10 ? 0 : 0.05;
    } else if (duration.includes("weeks")) {
      const weeks = parseInt(duration);
      repaymentDate.setDate(now.getDate() + weeks * 7);
      interestRate = 0.07;
    } else if (duration.includes("months")) {
      const months = parseInt(duration);
      repaymentDate.setMonth(now.getMonth() + months);
      interestRate = 0.1;
    }

    const repaymentAmount = parseFloat(amount || 0) * (1 + interestRate);

    setRepaymentInfo({
      amount: repaymentAmount.toFixed(2),
      dueDate: repaymentDate.toDateString(),
    });
  };

  

  const fetchLoanData = async () => {
    try {
      const response = await fetch(`https://ifund-backend.onrender.com/api/loan/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setLoanHistory(data.loans);
        setLoanLimit(data.loanLimit);
        setActiveLoan(data.loans.find((loan) => loan.status === "active"));
      } else {
        console.error("Failed to fetch loan data");
      }
    } catch (error) {
      console.error("Error fetching loan data:", error);
    }
  };

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login"); 
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`https://ifund-backend.onrender.com/api/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        if (response.data && response.data.account) {
          setBalance(response.data.account.balance); 
        } else {
          setBalance("Not Available");
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setBalance("Error");
      }
    };

    fetchAccountDetails();
    fetchLoanData();
  }, [token, role, userId, navigate]);

  const handleLoanRequest = async () => {
    if (parseFloat(loanDetails.amount) > parseFloat(loanLimit)) {
      setErrorMessage(
        `Your requested amount of KES ${loanDetails.amount} exceeds your loan limit of KES ${loanLimit}.`
      );
      return;
    }

    try {
      const response = await fetch("https://ifund-backend.onrender.com/api/loans/borrow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...loanDetails,
          userId,
          repaymentAmount: repaymentInfo.amount,
          repaymentDueDate: repaymentInfo.dueDate,
        }),
      });

      if (response.ok) {
        alert("Loan request submitted successfully!");
        setLoanDetails({ amount: "", duration: "10 days", purpose: "" });
        fetchLoanData();
        setShowLoanModal(false);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || "Error submitting loan request.");
      }
    } catch (error) {
      console.error("Error submitting loan request:", error);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleRepayment = async () => {
    if (!repaymentAmount || repaymentAmount <= 0) {
      alert("Please enter a valid repayment amount.");
      return;
    }

    if (parseFloat(repaymentAmount) > outstandingLoanAmount) {
      alert(`you can only pay a maximum of ${outstandingLoanAmount}`);
      return;
    }

    if (parseFloat(repaymentAmount) > balance) {
      alert("Insufficient balance to repay your loan. Top Up your account");
      return;
    }

    try {
      const response = await fetch(`https://ifund-backend.onrender.com/loans/${activeLoan.id}/repay`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          repaymentAmount,
        }),
      });

      if (response.ok) {
        alert("Repayment successful!");
        fetchLoanData();
        setShowRepaymentModal(false);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error processing repayment.");
      }
    } catch (error) {
      console.error("Error processing repayment:", error);
      alert("An error occurred. Please try again later.");
    }
  };


  return (
    <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Loans</h2>
  </div>
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Loan Limit</Card.Title>
          <Card.Text>
            <strong>Current Loan Limit:</strong> KES {loanLimit}
          </Card.Text>
          <Button
            variant="primary"
            onClick={() => setShowLoanModal(true)}
            disabled={!!activeLoan}
          >
            {activeLoan ? "Active Loan Exists" : "Request a Loan"}
          </Button>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Loan History</Card.Title>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Repayment Amount</th>
                <th>Due Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loanHistory.map((loan) => (
                <tr key={loan.id} className={loan.status === "Declined" ? "table-danger" : "table-success"}>
                  <td>{loan.id}</td>
                  <td>KES {loan.amount}</td>
                  <td>{loan.status}</td>
                  <td>KES {loan.repayment_amount}</td>
                  {loan.status === "Declined" ? (
                    <td>N/A</td>
                  ) : (
                    <td>{loan.repayment_due_date}</td>
                  )}
                  <td>
                    {loan.status === "Approved" && (
                      <Button
                        variant="success"
                        onClick={() => {
                          setActiveLoan(loan);
                          setShowRepaymentModal(true);
                          setRepaymentAmount(loan.repayment_amount);
                          setOutstandingLoanAmount(loan.repayment_amount);
                        }}
                      >
                        Repay
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Loan Request Modal */}
      <Modal show={showLoanModal} onHide={() => setShowLoanModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request a Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Loan Amount</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                placeholder="Enter loan amount"
                value={loanDetails.amount}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loan Duration</Form.Label>
              <Form.Select
                name="duration"
                value={loanDetails.duration}
                onChange={handleChange}
              ><option value="" disabled>Select a loan Duration</option>
                <option value="10 days">10 days</option>
                <option value="20 days">20 days</option>
                <option value="1 months">1 month</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Purpose of Loan</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="purpose"
                placeholder="Explain the purpose of the loan"
                value={loanDetails.purpose}
                onChange={handleChange}
              />
            </Form.Group>
            <Card className="p-3 bg-light">
              <strong>Repayment Information</strong>
              <p>
                <strong>Repayment Amount:</strong> KES {repaymentInfo.amount}
                <br />
                <strong>Repayment Due Date:</strong> {repaymentInfo.dueDate}
              </p>
            </Card>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoanModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleLoanRequest}>
            Submit Request
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Repayment Modal */}
      <Modal show={showRepaymentModal} onHide={() => setShowRepaymentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Repay Loan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
                      <Row className="mb-3">
                        <Col xs={12}>
                          <h5>Withdrawable Balance: {balance !== null ? `KES ${balance}` : "Loading..."}</h5>
                        </Col>
                      </Row>
            <Form.Group className="mb-3">
              <Form.Label>Repayment Amount (KES)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter repayment amount"
                value={repaymentAmount}
                onChange={(e) => setRepaymentAmount(e.target.value)}
              />
            </Form.Group>
            <p>
              <strong>Outstanding Loan:</strong> KES {outstandingLoanAmount}
            </p>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRepaymentModal(false)}
          >
            Close
          </Button>
          <Button variant="success" onClick={handleRepayment}>
            Repay
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default LoansPage;
