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
import { FaPen, FaCamera } from "react-icons/fa";
import axios from "axios";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const navigate = useNavigate();
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
          `https://newly-bright-chigger.ngrok-free.app/api/superadmin/user-details/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data.user;
        setUser(userData);

        setEditUser({
          full_name: userData.full_name,
          email: userData.email,
          phone:userData.phone,
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
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `https://newly-bright-chigger.ngrok-free.app/api/superadmin/user-details/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const userData = response.data.user;
        setUser(userData);

        setEditUser({
          full_name: userData.full_name,
          email: userData.email,
          phone:userData.phone,
          balance: userData.balance,
          loan_limit: userData.loan_limit,
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };
    fetchUserDetails();
  }, [token, role, userId]);


  const handleEditUser = async () => {
    try {
      await axios.put(
        `https://newly-bright-chigger.ngrok-free.app/superadmin/users/${user.user_id}`,
        {
          full_name: editUser.full_name,
          email: editUser.email,
          phone: editUser.phone,
          balance: editUser.balance,
          loan_limit: editUser.loan_limit,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('success');
      fetchUserDetails();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="p-0 me-3"
          style={{ color: "white" }}
        >
          <i
            className="bi bi-arrow-left back-btn"
            style={{ fontSize: "2rem" }}
          ></i>
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
                  <Form.Control
                    type="text"
                    value={editUser.full_name}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        full_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User ID</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={user.user_id}
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
                    type="text"
                    placeholder={user.email}
                    value={editUser.email}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={user.phone}
                    value={editUser.phone}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        phone: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Savings Balance</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder={user.balance}
                    value={editUser.balance}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        balance: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Loan Limit</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder={user.loan_limit}
                    value={editUser.loan_limit}
                    onChange={(e) =>
                      setEditUser({
                        ...editUser,
                        loan_limit: e.target.value,
                      })
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
                    src={
                      user.front_id_path || "https://via.placeholder.com/150"
                    }
                    alt="front_id"
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
                    src={
                      user.back_id_path || "https://via.placeholder.com/150"
                    }
                    alt="back_id"
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
            <Row >
              <Col>
                <Button variant="primary" onClick={handleEditUser}>Save</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDetails;
