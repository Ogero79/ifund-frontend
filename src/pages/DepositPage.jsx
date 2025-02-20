import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const DepositPage = () => {
  const navigate = useNavigate();
  const [depositDetails, setDepositDetails] = useState({
    amount: "",
    mpesaNumber: "",
    description: "",
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");
  const [loading, setLoading] = useState(false);

  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  const storedTheme = localStorage.getItem("theme") || "light";
  const theme = storedTheme;
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepositDetails({ ...depositDetails, [name]: value });
  };

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

  }, [token, role, navigate]);

  const postNotification = async (message) => {
    try {
      await fetch("https://ifund-backend.onrender.com/api/notifications", {
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

  const handleDeposit = async (e) => {
    e.preventDefault();

    if (!depositDetails.amount || depositDetails.amount <= 0) {
      setErrorAlert("Please enter a valid deposit amount greater than 0.");
      return;
    }

    if (!depositDetails.mpesaNumber.match(/^\d{10}$/)) {
      setErrorAlert("Please enter a valid M-Pesa number.");
      return;
    }

    if (!userId) {
      setErrorAlert("User not logged in. Please log in to continue.");
      return;
    }

    setErrorAlert("");
    setLoading(true);

    try {
      const formattedPhoneNumber = depositDetails.mpesaNumber.replace(/^0/, "254");

      const response = await fetch("https://ifund-backend.onrender.com/api/deposits", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...depositDetails,
          mpesaNumber: formattedPhoneNumber,  
          userId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await postNotification(
          `Your deposit of KES.${depositDetails.amount} is being processed.`
        );

        setLoading(false);
        setShowAlert(true);
        setDepositDetails({
          amount: "",
          mpesaNumber: "",
          description: "",
        });

        setTimeout(() => {
          setShowAlert(false);
        }, 3000);
        navigate("/user/home");
      } else {
        setLoading(false);
        setErrorAlert(data.message || "An error occurred. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      setErrorAlert(
        "There was an error processing your deposit. Please try again."
      );
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="p-0 me-3"
          style={{ color: "black" }}
        >
          <i
            className="bi bi-arrow-left back-btn"
            style={{ fontSize: "2rem" }}
          ></i>
        </Button>
        <h2 className="mb-0">Deposit Funds</h2>
      </div>

      {showAlert && (
        <Alert
          variant="success"
          onClose={() => setShowAlert(false)}
          dismissible
        >
          Deposit successful! Your funds are now being processed.
        </Alert>
      )}

      {errorAlert && (
        <Alert variant="danger" onClose={() => setErrorAlert("")} dismissible>
          {errorAlert}
        </Alert>
      )}

      <Card className="p-4">
        <Form onSubmit={handleDeposit}>
          <Row className="mb-3">
            <Col xs={12}>
              <Form.Group>
                <Form.Label>Deposit Amount (KES)</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  placeholder="Enter amount"
                  value={depositDetails.amount}
                  onChange={handleChange}
                  min="10"
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
                  value={depositDetails.mpesaNumber}
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
                  placeholder="Add a note for this deposit"
                  value={depositDetails.description}
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
                style={{ backgroundColor: "#11864E", borderColor: "#11864E" }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" /> Processing...
                  </>
                ) : (
                  "Confirm Deposit"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default DepositPage;
