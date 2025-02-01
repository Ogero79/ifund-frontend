import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const InviteFriendsPage = () => {
  const navigate = useNavigate();
  const [referralLink, setReferralLink] = useState('');
  const [referrals, setReferrals] = useState([]);
  const [unredeemedRewards, setUnredeemedRewards] = useState(0);
  const [redeemedRewards, setRedeemedRewards] = useState(0);
  const [amount, setAmount] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const userId = localStorage.getItem("userId");

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

    const fetchReferrals = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/referrals/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setReferrals(response.data.referrals);
        setUnredeemedRewards(response.data.rewardsEarned);
        const redeemedTotal = response.data.referrals
          .filter(referral => referral.redeemed)
          .length * 25;
        setRedeemedRewards(redeemedTotal);
        setReferralLink(response.data.referralLink);
      } catch (error) {
        console.error('Error fetching referrals:', error);
        alert('Failed to load referral data.');
      }
    };

    fetchReferrals();
  }, [token, role, userId, navigate]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  const handleAddToSavings = async () => {
    const amount = unredeemedRewards;
    try {
      const response = await axios.post(
        `http://localhost:5000/api/add-to-savings`,
        { userId, amount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      const { message } = response.data;
      alert(message);
      setShowAlert(true);
      setUnredeemedRewards(0); 
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(`Error: ${error.response.data.message}`); 
      } else {
        alert('Failed to add rewards to savings.'); 
      }
      console.error('Add to Savings Error:', error);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date instanceof Date && !isNaN(date) ? date.toLocaleString('en-US', options) : 'Invalid Date';
  };

  return (
    <Container className="my-4 px-3">
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
          <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
        </Button>
        <h2 className="mb-0">Invite Friends</h2>
      </div>
      <Card className="mb-3 p-3">
        <Card.Body>
          <Card.Title className="fs-5">Share Your Referral Link</Card.Title>
          <Card.Text className="fs-6">
            Invite your friends to join iFund and earn rewards when they sign up and start saving!
          </Card.Text>
          <Row className="align-items-center">
            <Col xs={9}>
              <Form.Control
                type="text"
                value={referralLink}
                readOnly
                style={{ backgroundColor: '#f8f9fa', cursor: 'default' }}
              />
            </Col>
            <Col xs={3} className="text-end">
              <Button variant="outline-primary" onClick={handleCopyLink} size="sm">
                <i className="bi bi-clipboard me-2"></i> {copied ? 'Copied!' : 'Copy'}
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <Card className="p-3 shadow-sm rounded mb-4">
        <Card.Body>
          <Card.Title className="fs-5">Referral Rewards</Card.Title>
          <Row className="mb-3">
            <Col>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Unredeemed Rewards</Card.Title>
                  <Card.Text className="fs-4 text-primary">Ksh {unredeemedRewards}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card className="text-center">
                <Card.Body>
                  <Card.Title>Redeemed Rewards</Card.Title>
                  <Card.Text className="fs-4 text-success">Ksh {redeemedRewards}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Button
            variant="primary"
            className="d-flex align-items-center w-100"
            onClick={handleAddToSavings}
            disabled={unredeemedRewards === 0}
          >
            <i className="bi bi-bank me-2"></i>
            Add Unredeemed Rewards to Savings
          </Button>
        </Card.Body>
      </Card>
      <Card className="p-3 shadow-sm rounded">
        <Card.Body>
          <Card.Title className="fs-5 d-flex align-items-center">
            <i className="bi bi-person-fill me-2" style={{ fontSize: '20px' }}></i>
            Your Referrals
          </Card.Title>
          <ul className="list-unstyled mt-3 fs-6">
            {referrals.map((referral, index) => (
              <li key={index} className="d-flex align-items-center mb-2">
                <i
                  className={`bi ${referral.joined ? 'bi-check-circle-fill text-success' : 'bi-clock text-warning'} me-2`}
                  style={{ fontSize: '18px' }}
                ></i>
                <span>{referral.name}</span>
                <div className="ms-3">
                  <small className="text-muted">
                    Joined on {referral.joinedDate ? formatDate(referral.joinedDate) : 'Date not available'}
                  </small>
                </div>
                <div
                  className={`ms-auto p-1 rounded text-white ${referral.accountStatus === 'active' ? 'bg-success' : 'bg-danger'}`}
                  style={{ fontSize: '14px' }}
                >
                  {referral.accountStatus === 'active' ? 'Active' : 'Inactive'}
                </div>
              </li>
            ))}
          </ul>
        </Card.Body>
      </Card>
      {showAlert && (
        <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
          Unredeemed rewards have been successfully added to your savings!
        </Alert>
      )}
    </Container>
  );
};

export default InviteFriendsPage;
