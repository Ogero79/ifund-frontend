import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  Container,
  Form,
  Modal,
  Row,
  Col,
} from "react-bootstrap";
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

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `https://ifund-backend.onrender.com/api/superadmin/user-details/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
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

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
      return;
    }
    fetchUserDetails();
  }, [token, role, userId]);

  const handleEditUser = async () => {
    try {
      await axios.put(
        `https://ifund-backend.onrender.com/superadmin/users/${user.user_id}`,
        editUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User updated successfully");
      fetchUserDetails();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(
        `https://ifund-backend.onrender.com/api/superadmin/users/delete/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("User deleted successfully");
      navigate("/superadmin/users-list");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (!user) return <div>Loading user data...</div>;

  return (
    <Container className="py-4">
      <h2>User Details</h2>
      <Card>
  <Card.Body>
    <Form>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={editUser.full_name}
              onChange={(e) =>
                setEditUser({ ...editUser, full_name: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>User ID</Form.Label>
            <Form.Control
              type="text"
              value={user.user_id}
              disabled
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editUser.email}
              onChange={(e) =>
                setEditUser({ ...editUser, email: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              value={editUser.phone}
              onChange={(e) =>
                setEditUser({ ...editUser, phone: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Balance</Form.Label>
            <Form.Control
              type="text"
              value={editUser.balance}
              onChange={(e) =>
                setEditUser({ ...editUser, balance: e.target.value })
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Loan Limit</Form.Label>
            <Form.Control
              type="number"
              value={editUser.loan_limit}
              onChange={(e) =>
                setEditUser({ ...editUser, loan_limit: e.target.value })
              }
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Front ID</Form.Label>
            <img
              src={user.front_id_path || "https://via.placeholder.com/150"}
              alt="Front ID"
              className="rounded"
              style={{
                objectFit: "cover",
                maxHeight: "250px",
                height: "auto",
                width: "100%",
                border: "2px solid #ddd",
              }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Back ID</Form.Label>
            <img
              src={user.back_id_path || "https://via.placeholder.com/150"}
              alt="Back ID"
              className="rounded"
              style={{
                objectFit: "cover",
                maxHeight: "250px",
                height: "auto",
                width: "100%",
                border: "2px solid #ddd",
              }}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button variant="primary" onClick={handleEditUser}>
        Save Changes
      </Button>
      <Button
        variant="danger"
        className="ms-3"
        onClick={() => setShowDeleteModal(true)}
      >
        Delete User
      </Button>
    </Form>
  </Card.Body>
</Card>


      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserDetails;