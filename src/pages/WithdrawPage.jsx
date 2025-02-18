import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 

const WithdrawPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  const [withdrawDetails, setWithdrawDetails] = useState({
    amount: "",
    mpesaNumber: "",
    description: "",
  });
  const [balance, setBalance] = useState(null); 
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("info");

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

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`https://newly-bright-chigger.ngrok-free.app/api/accounts/${userId}`, {
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
  }, [token, role, userId, navigate]);

  const postNotification = async (message) => {
    try {
      await fetch("https://newly-bright-chigger.ngrok-free.app/api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, message }),
      });
    } catch (error) {
      console.error("Error posting notification:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWithdrawDetails({ ...withdrawDetails, [name]: value });
  };


  const handleWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawDetails.mpesaNumber.match(/^\d{10}$/)) {
      setAlertMessage("Please enter a valid M-Pesa number.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }

    if (parseFloat(withdrawDetails.amount) > balance) {
      setAlertMessage("Insufficient balance for this withdrawal.");
      setAlertVariant("danger");
      setShowAlert(true);
      return;
    }


    try {
      const response = await fetch("https://newly-bright-chigger.ngrok-free.app/api/withdrawals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: withdrawDetails.amount,
          mpesaNumber: withdrawDetails.mpesaNumber,
          description: withdrawDetails.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertVariant("success");
        await postNotification(`Your withdrawal of KES.${withdrawDetails.amount} is being processed.`);
        setBalance((prev) => prev - parseFloat(withdrawDetails.amount)); 
        setWithdrawDetails({ amount: "", mpesaNumber: "", description: "" }); 
        setAlertMessage(data.message);
      }else{
        setAlertMessage(data.message);
        setAlertVariant("danger");
      }

      setShowAlert(true);
    } catch (error) {
      console.error("Error during withdrawal:", error);
      setAlertMessage(data.message);
      setAlertVariant("danger");
      setShowAlert(true);
    }
  };

  return (
    <Container className="py-4">
        <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Withdraw Funds</h2>
  </div>

      {showAlert && (
        <Alert
          variant={alertVariant}
          onClose={() => setShowAlert(false)}
          dismissible
        >
          {alertMessage}
        </Alert>
      )}

      <Card className="p-4">
        <Form onSubmit={handleWithdraw}>
          <Row className="mb-3">
            <Col xs={12}>
              <h5>Withdrawable Balance: {balance !== null ? `KES ${balance}` : "Loading..."}</h5>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Withdraw Amount (KES)</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={withdrawDetails.amount}
                  onChange={handleChange}
                  min="10"
                  max={balance || 0} 
                  step="1"
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>M-Pesa Number</Form.Label>
                <Form.Control
                  type="text"
                  name="mpesaNumber"
                  placeholder="Enter your M-Pesa number (e.g., 0712345678)"
                  value={withdrawDetails.mpesaNumber}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Description (Optional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  placeholder="Add a note for this withdrawal"
                  value={withdrawDetails.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col xs={12} className="text-center">
              <Button
                type="submit"
                className="w-100"
                style={{ backgroundColor: "#e74c3c", borderColor: "#e74c3c" }}
                disabled={balance === null} 
              >
                Confirm Withdrawal
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default WithdrawPage;
