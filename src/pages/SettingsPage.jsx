import React, { useEffect, useState } from 'react';
import { ListGroup, Button } from 'react-bootstrap';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [userImage, setUserImage] = useState('https://via.placeholder.com/60');
  const [accountStatus, setAccountStatus] = useState('inactive');
  const [currentTheme, setCurrentTheme] = useState('Light');
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');
  const storedUserName = localStorage.getItem("userName");

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
    if (storedUserName) {
      const firstName = storedUserName.split(" ")[0];
      setUserName(firstName);
    }

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(`https://ifund-backend.onrender.com/api/accounts/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, 
        });
        if (response.data && response.data.account) {
          setAccountStatus(response.data.account.accountStatus); 
        } else {
          setAccountStatus("inactive");
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setAccountStatus("Error");
      }
    };

    fetchAccountDetails();
  }, [token, role, userId, navigate]);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="settings-page container-fluid px-3 px-md-4 px-lg-5 py-4">
      <Header
        userImage={userImage}
        userName={userName}
      />
      <div className="profile-section d-flex align-items-center py-4 px-3 mb-4 bg-light rounded-3">
        <div className="flex-grow-1">
          <h5 className="fw-bold mb-0 d-flex align-items-center">
            {storedUserName}
            {accountStatus === 'active' && (
              <i
                className="bi bi-patch-check-fill text-primary ms-2"
                style={{ fontSize: '1.2rem' }}
              ></i>
            )}
          </h5>
          <p className="text-muted mb-0">User ID: {userId}</p>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={() => handleNavigation('/profile')}
        >
          View Full Profile
        </Button>
      </div>

      <div className="settings-list mt-4">
        <ListGroup variant="flush" style={{marginBottom: '100px'}}>
          <ListGroup.Item action onClick={() => handleNavigation('/account')}>
            <i className="bi bi-shield-lock me-3" style={{ fontSize: '1.2rem' }}></i>
            Account
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Manage account settings like email and password
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/privacy')}>
            <i className="bi bi-lock me-3" style={{ fontSize: '1.2rem' }}></i>
            Privacy
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Control your data sharing and privacy preferences
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/theme')}>
            <i className="bi bi-palette me-3" style={{ fontSize: '1.2rem' }}></i>
            Theme
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Current theme: {currentTheme}
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/notification-preferences')}>
            <i className="bi bi-bell me-3" style={{ fontSize: '1.2rem' }}></i>
            Notifications
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Set your notifications preferences
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/user/help')}>
            <i className="bi bi-question-circle me-3" style={{ fontSize: '1.2rem' }}></i>
            Help
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Get assistance or view FAQs
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/invite')}>
            <i className="bi bi-share me-3" style={{ fontSize: '1.2rem' }}></i>
            Invite a Friend
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Share the app with your friends and family
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => handleNavigation('/feedback')}>
            <i className="bi bi-chat-dots me-3" style={{ fontSize: '1.2rem' }}></i>
            Feedback
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Share your thoughts to help us improve
            </p>
          </ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
            <i className="bi bi-box-arrow-right me-3" style={{ fontSize: '1.2rem' }}></i>
            Log Out
            <p className="text-muted mb-0" style={{ fontSize: '0.85rem' }}>
              Sign out of your account
            </p>
          </ListGroup.Item>
        </ListGroup>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default SettingsPage;
