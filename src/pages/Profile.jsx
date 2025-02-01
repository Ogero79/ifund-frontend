import React, { useState, useEffect } from "react";
import { Card, Form, Modal, Button, Spinner } from "react-bootstrap";
import { FaPen, FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProfilePage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");
  const [user, setUser] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [showProfilePicModal, setShowProfilePicModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedPhone, setEditedPhone] = useState("");

  const storedTheme = localStorage.getItem("theme") || "light";
  const theme = storedTheme;
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/profiles/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/profiles/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token, role, userId, navigate]);

  const handleFieldChange = (field, value) => {
    if (field === "name") {
      setEditedName(value);
    } else if (field === "phone") {
      setEditedPhone(value);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("name", editedName || user.name);
    formData.append("phone", editedPhone || user.phone);

    if (profilePic) {
      formData.append("profilePic", profilePic);
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/profiles/${userId}/edit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUser(response.data.user);
      setShowEditModal(false);
      setShowProfilePicModal(false);
      setProfilePic(null);

      fetchUserDetails();
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }

    setLoading(false);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePic(file);
    }
  };

  return (
    <div className="profile-page container py-4">
      <div className="container">
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
          <h2 className="mb-0">Profile</h2>
        </div>
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <Card className="shadow-lg">
              <Card.Body className="text-center">
                <div className="position-relative d-inline-block mb-4">
                  <img
                    src={
                      user.profile_picture || "https://via.placeholder.com/150"
                    }
                    alt="Profile"
                    className="rounded-circle"
                    style={{
                      width: "150px",
                      height: "150px",
                      objectFit: "cover",
                      border: "2px solid #ddd",
                    }}
                  />
                  <FaCamera
                    className="position-absolute p-2 bg-white text-primary shadow rounded-circle"
                    style={{
                      fontSize: "1.5rem",
                      bottom: 0,
                      right: 0,
                      cursor: "pointer",
                      width: "50px",
                      height: "50px",
                    }}
                    title="Change Profile Picture"
                    onClick={() => setShowProfilePicModal(true)}
                  />
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-center align-items-center">
                    <h2 className="font-weight-bold mb-0">{user.name}</h2>
                    <FaPen
                      onClick={() => {
                        setEditedName(user.name);
                        setEditedPhone(user.phone);
                        setShowEditModal(true);
                      }}
                      className="ms-2 text-primary"
                      style={{ cursor: "pointer", fontSize: "1.2rem" }}
                      title="Edit Name and Phone"
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center mt-2">
                    <p className="mb-0">{user.phone}</p>
                  </div>
                </div>
                <p className="text-muted">{user.email}</p>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Name and Phone</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={editedName}
                onChange={(e) => handleFieldChange("name", e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="phone" className="mt-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={editedPhone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Save"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showProfilePicModal}
        onHide={() => setShowProfilePicModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Profile Picture</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="profilePicUpload">
              <Form.Label>Upload a new profile picture</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowProfilePicModal(false)}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave("profilePic")}
            disabled={loading}
          >
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Save Picture"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProfilePage;
