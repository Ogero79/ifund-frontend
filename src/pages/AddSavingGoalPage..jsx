import React, { useState, useEffect } from "react";
import { Container, Card, Form, Button, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddSavingGoalPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId"); 
  const token = localStorage.getItem("authToken");

  const [balance, setBalance] = useState(null);
  const role = localStorage.getItem("userRole");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

    const storedTheme = localStorage.getItem('theme') || 'light';
  const theme = storedTheme;
    useEffect(() => {
      document.body.className = theme; 
    }, [theme]);

  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    description: "",
    deadline: "",
    deposit: "0", 
    image: null,
    customDeposit: "", 
  });

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login"); 
      return;
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.account) {
          setBalance(response.data.account.unallocated);
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
      await fetch("http://localhost:5000/api/notifications", {
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

  const handleAddGoal = async () => {
    const depositAmount = newGoal.deposit === "custom" ? parseFloat(newGoal.customDeposit) : parseFloat(newGoal.deposit);

    if (!newGoal.title || !newGoal.target || !newGoal.deadline || !newGoal.description) {
      setAlertMessage("Please fill in all required fields.");
      setShowAlert(true);
      return;
    }
    if (isNaN(depositAmount) || depositAmount < 0) {
      setAlertMessage("Deposit amount must be a positive number.");
      setShowAlert(true);
      return;
    }

    if (depositAmount > balance) {
      setAlertMessage("Insufficient balance for this deposit.");
      setShowAlert(true);
      return;
    }

    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("title", newGoal.title);
    formData.append("target_amount", newGoal.target);
    formData.append("description", newGoal.description);
    formData.append("end_date", newGoal.deadline);
    formData.append("deposit", depositAmount);
    if (newGoal.image) {
      formData.append("image", newGoal.image);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/goals",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Goal added successfully!");
        await postNotification(`Your savings goal, '${newGoal.title}' , has been successfully created! Start contributing now to achieve your target of ${newGoal.target}  by ${newGoal.deadline} . Every step counts!`);
        navigate("/user/savings"); 
      }
    } catch (error) {
      console.error("Failed to create goal:", error);
      setAlertMessage("Failed to create goal. Please try again.");
      setShowAlert(true);
    }
  };

  const handleImageChange = (e) => {
    setNewGoal({ ...newGoal, image: e.target.files[0] });
  };

  const handleDepositChange = (e) => {
    const depositValue = e.target.value;
    setNewGoal({
      ...newGoal,
      deposit: depositValue,
      customDeposit: depositValue === "custom" ? newGoal.customDeposit : "", 
    });
  };

  return (
    <Container className="py-4">
  <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
    <h2 className="mb-0">Add a New Saving Goal</h2>
  </div>
      {showAlert && <div className="alert alert-danger">{alertMessage}</div>}
      <Card>
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col xs={12}>
                <h5>Unallocated Balance: {balance !== null ? `KES ${balance}` : "Loading..."}</h5>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Goal Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter goal title (e.g., Emergency Fund)"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({ ...newGoal, title: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter target amount"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deadline</Form.Label>
                  <Form.Control
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Goal Image</Form.Label>
                  <Form.Control type="file" onChange={handleImageChange} />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Goal Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter a description for the goal"
                    value={newGoal.description}
                    onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>Deposit Amount</Form.Label>
                  <Form.Control
                    as="select"
                    value={newGoal.deposit}
                    onChange={handleDepositChange}
                  >
                    <option value="0">0</option>
                    <option value="100">100</option>
                    <option value="500">500</option>
                    <option value="1000">1000</option>
                    <option value="custom">Custom</option>
                  </Form.Control>
                  {newGoal.deposit === "custom" && (
                    <Form.Control
                      type="number"
                      placeholder="Enter custom deposit"
                      value={newGoal.customDeposit}
                      onChange={(e) => setNewGoal({ ...newGoal, customDeposit: e.target.value })}
                      className="mt-2"
                    />
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button variant="primary" onClick={handleAddGoal}>
                  Add Goal
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddSavingGoalPage;
