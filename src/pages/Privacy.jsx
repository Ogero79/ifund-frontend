import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const [privacySettings, setPrivacySettings] = useState({
    shareData: false,
    profileVisibility: 'public',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();


  const storedTheme = localStorage.getItem('theme') || 'light';
const theme = storedTheme;
  useEffect(() => {
    document.body.className = theme; 
  }, [theme]);


  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <div className="container my-4 px-3">
            <div className="d-flex align-items-center mb-4">
        <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{color:'black'}}>
        <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
        </Button>
        <h2 className="mb-0">Privacy Settings</h2>
      </div>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">Privacy settings updated successfully!</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="shareData">
          <Form.Check
            type="checkbox"
            label="Share my data with third parties"
            checked={privacySettings.shareData}
            onChange={(e) => setPrivacySettings({ ...privacySettings, shareData: e.target.checked })}
          />
        </Form.Group>

        <Form.Group controlId="profileVisibility">
          <Form.Label>Profile Visibility</Form.Label>
          <Form.Control
            as="select"
            value={privacySettings.profileVisibility}
            onChange={(e) => setPrivacySettings({ ...privacySettings, profileVisibility: e.target.value })}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
            <option value="friends">Friends Only</option>
          </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default Privacy;
