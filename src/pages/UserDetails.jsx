import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Container, Form, Modal, Row, Col } from "react-bootstrap";
import axios from "axios";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editUser, setEditUser] = useState({
    full_name: "",
    email: "",
    phone: "",
    balance: "",
    loan_limit: "",
  });

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
      return;
    }
    fetchUserDetails();
  }, [token, role, userId]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `https://ifund-backend.onrender.com/api/superadmin/user-details/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const userData = response.data.user;
      setUser(userData);
      setEditUser({
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        balance: userData.balance,
        loan_limit: userData.loan_limit,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`https://ifund-backend.onrender.com/api/superadmin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User deleted successfully");
      setShowDeleteModal(false);
      navigate("/admin-dashboard"); // Redirect after deletion
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: "white" }}>
          <i className="bi bi-arrow-left back-btn" style={{ fontSize: "2rem" }}></i>
        </Button>
        <h2 className="mb-0">User Details</h2>
      </div>

      <Card>
        <Card.Body>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Name</Form.Label>
                  <Form.Control type="text" value={editUser.full_name} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control type="number" value={user.user_id} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="text" value={editUser.email} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control type="number" value={editUser.phone} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Savings Balance</Form.Label>
                  <Form.Control type="text" value={editUser.balance} disabled />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loan Limit</Form.Label>
                  <Form.Control type="number" value={editUser.loan_limit} disabled />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Front ID</Form.Label>
                  <img
                    src={user.front_id_path || "https://via.placeholder.com/150"}
                    alt="front_id"
                    className="rounded"
                    style={{ objectFit: "cover", maxHeight: "250px", width: "100%", border: "2px solid #ddd" }}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Back ID</Form.Label>
                  <img
                    src={user.back_id_path || "https://via.placeholder.com/150"}
                    alt="back_id"
                    className="rounded"
                    style={{ objectFit: "cover", maxHeight: "250px", width: "100%", border: "2px solid #ddd" }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete User</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user? This action cannot be undone.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDetails;
