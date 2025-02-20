import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Header = ({ userName }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`https://ifund-backend.onrender.com/api/profiles/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [token, role, userId, navigate]);

  const onBellClick = () => {
    navigate("/user/notifications");
  };

  return (
    <div>
      <Row style={{ marginBottom: '50px' }}>
        <Col xs={6} md={6} className="d-flex align-items-center">
          <img
            src={user.profile_picture || "https://placehold.co/50"} 
            alt="User"
            className="rounded-circle"
            style={{ width: 60, height: 60, objectFit: 'cover' }}
          />
          <h4 className="ms-2">Hello, {userName} 👋</h4>
        </Col>

        <Col xs={6} md={6} className="d-flex justify-content-end align-items-center">
          <FaBell
            size={22}
            className="me-2"
            onClick={onBellClick} 
            style={{ cursor: 'pointer' }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Header;
