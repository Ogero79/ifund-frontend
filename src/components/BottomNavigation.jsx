import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaPiggyBank, FaUserFriends, FaCog } from 'react-icons/fa';
import './BottomNav.css';

const BottomNavigation = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <Row
      className="fixed-bottom mx-auto py-3 mb-3"
      style={{
        width: '100%',
        maxWidth: '600px',
        background: '#1d1d1d',
        borderRadius: '50px',
        justifyContent: 'center',
        alignItems: 'center',
        border: '1px solid #ddd',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', 
      }}
    >
      <Col xs={3} className="text-center">
        <Link to="/user/home" className="nav-link">
          <FaHome
            size={28}
            className={`nav-icon ${isActive('/user/home') ? 'active' : ''}`}
          />
        </Link>
      </Col>
      <Col xs={3} className="text-center">
        <Link to="/user/savings" className="nav-link">
          <FaPiggyBank
            size={28}
            className={`nav-icon ${isActive('/user/savings') ? 'active' : ''}`}
          />
        </Link>
      </Col>
      <Col xs={3} className="text-center">
        <Link to="/user/communities" className="nav-link">
          <FaUserFriends
            size={28}
            className={`nav-icon ${isActive('/user/communities') ? 'active' : ''}`}
          />
        </Link>
      </Col>
      <Col xs={3} className="text-center">
        <Link to="/user/settings" className="nav-link">
          <FaCog
            size={28}
            className={`nav-icon ${isActive('/user/profile') ? 'active' : ''}`}
          />
        </Link>
      </Col>
    </Row>
  );
};

export default BottomNavigation;
