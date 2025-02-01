import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate,Link } from 'react-router-dom';
import axios from 'axios';

const RegisterStep4 = () => {
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/register/step-3');
    }  else {
      document.getElementById('code-0').focus();
    }
  }, [navigate]);
  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/[0-9]/) && value.length === 1) {
      const newCode = [...authCode];
      newCode[index] = value;
      setAuthCode(newCode);
      if (index < 5) {
        document.getElementById(`code-${index + 1}`).focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      const newCode = [...authCode];
      if (authCode[index] === '') {
        if (index > 0) {
          document.getElementById(`code-${index - 1}`).focus();
        }
      } else {
        newCode[index] = '';
        setAuthCode(newCode);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (authCode.includes('')) {
      setError('Please enter the full authentication code.');
      return;
    }

    const code = authCode.join('');

    try {
      setLoading(true); 
      const response = await axios.post('http://localhost:5000/api/register/step4', { userId, verificationCode: code });

      if (response.status === 200 || response.status === 201) {
        window.open('/login', '_blank');
      }
      
    } catch (error) {
      console.error('Error verifying authentication code:', error);
      setError('Invalid authentication code. Please try again.');
    } finally {
      setLoading(false); 
    }
  };
  
  const handleResend = async () => {
    setResendDisabled(true);
    try {
      await axios.post('http://localhost:5000/api/login/resend-code', { userId });
      setError('A new verification code has been sent to your email.');
    } catch (err) {
      console.error('Error resending code:', err);
      setError('Failed to resend the verification code. Please try again later.');
    } finally {
      setTimeout(() => {
        setResendDisabled(false);
      }, 30000); 
    }
  };
  return (
    <>
      <div className="position-absolute top-0 left-0 p-4">
        <h1
          style={{
            maxWidth: '150px',
            color: '#1FC17B',
            fontFamily: 'Playwrite AU QLD Guides',
            fontWeight: 600,
            fontSize: '52px',
          }}
        >
          iFund
        </h1>
      </div>
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div
          className="w-100"
          style={{
            maxWidth: '600px',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
          }}
        >
          <h2 className="text-center mb-4">Register - Step 4: Enter Authentication Code</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Authentication Code</Form.Label>
              <div className="d-flex justify-content-between mb-3">
                {authCode.map((digit, index) => (
                  <Form.Control
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)} 
                    maxLength="1"
                    style={{
                      width: '50px',
                      textAlign: 'center',
                      fontSize: '20px',
                      marginRight: index < 5 ? '1rem' : '0',
                    }}
                    required
                  />
                ))}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={() => navigate('/register/step-3')}>
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{
                  backgroundColor: '#1FC17B', 
                  borderColor: '#1FC17B', 
                }}
                disabled={loading} 
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </Form>
        <div className="text-center mt-3">
          <Button variant="link" onClick={handleResend} disabled={resendDisabled}>
            {resendDisabled ? 'Please wait before resending...' : 'Resend Code'}
          </Button>
        </div>
        </div>
      </div>
    </>
  );
};

export default RegisterStep4;
