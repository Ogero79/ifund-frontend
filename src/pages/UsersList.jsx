import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { Spinner, Modal, Button, Form } from "react-bootstrap";

const UsersList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
    }

    const fetchUsersData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://ifund-backend.onrender.com/superadmin/users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setUsers(response.data.users || []);
      } catch (error) {
        console.error("Failed to fetch users data:", error);
        setError("Unable to load users data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, [token, role, navigate]);

  const handleEditClick = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `https://ifund-backend.onrender.com/superadmin/users/${selectedUser.user_id}`,
        {
          full_name: selectedUser.full_name,
          email: selectedUser.email,
          phone: selectedUser.phone,
          balance: selectedUser.balance,
          loan_limit: selectedUser.loan_limit,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUsers(
        users.map((user) => (user.id === selectedUser.id ? selectedUser : user))
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const viewUserDetails = (userId) => {
    navigate(`/superadmin/user-details/${userId}`);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "" : "expanded"}`}>
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />

        {loading && (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "100vh" }}
          >
            <Spinner
              animation="border"
              role="status"
              variant="primary"
              style={{ width: "4rem", height: "4rem" }}
            >
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="mt-4 container">
            <h5>Users</h5>
            {users.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Balance</th>
                    <th>Loan Limit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id}>
                      <td>{index + 1}</td>
                      <td>{user.full_name}</td>
                      <td>{user.user_id}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>{user.balance}</td>
                      <td>{user.loan_limit}</td>
                      <td>
                        <Button
                          variant="primary"
                          onClick={() => viewUserDetails(user.user_id)}
                        >
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Users available</p>
            )}
          </div>
        )}

        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          style={{
            color: "black",
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.full_name}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        full_name: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedUser.phone}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        phone: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Balance</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedUser.balance}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        balance: e.target.value,
                      })
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Loan Limit</Form.Label>
                  <Form.Control
                    type="number"
                    value={selectedUser.loan_limit}
                    onChange={(e) =>
                      setSelectedUser({
                        ...selectedUser,
                        loan_limit: e.target.value,
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSaveChanges}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default UsersList;
