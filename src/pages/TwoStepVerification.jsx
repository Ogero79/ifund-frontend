import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const TwoStepVerification = () => {
  const [authCode, setAuthCode] = useState(['', '', '', '', '', '']);
  const [message, setMessage] = useState('A verification code has been sent to your email.');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [twoStepEnabled, setTwoStepEnabled] = useState(true);
  const [resendDisabled, setResendDisabled] = useState(false);
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessage('');
    }, 5000);

    return () => clearTimeout(timer);
  }, [message]);

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
      setError('Please enter the full verification code.');
      return;
    }

    const code = authCode.join('');

    try {
      setLoading(true);
      setError('');
      setMessage('');
      setTwoStepEnabled(false);

      const response = await axios.post('https://ifund-backend.onrender.com/api/login/verify-code', {
        userId,
        verificationCode: code,
      });

      const { token, user} = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userRole', user.role);
        if (user.role === 'superadmin') {
          navigate('/admin/dashboard', { state: { userName: user.name } });
        } else if (user.role === 'user') {
          navigate('/user/home', { state: { userName: user.name } });
        } else {
          setError('Unknown user role. Please contact support.');
        }
    } catch (error) {
      console.error('Error verifying code:', error);
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
      setTwoStepEnabled(true);     
      localStorage.setItem('twoStep', twoStepEnabled);
    }
  };

  const handleResend = async () => {
    setResendDisabled(true);
    try {
      await axios.post('https://ifund-backend.onrender.com/api/login/resend-code', { userId });
      setMessage('A new verification code has been sent to your email.');
      setError('');
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
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      <div
        className="w-100"
        style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#fff', borderRadius: '8px' }}
      >
        <h3 className="text-center mb-4">Two-Step Verification</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Enter Verification Code</Form.Label>
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
                    marginRight: index < 5 ? '0.5rem' : '0',
                  }}
                  required
                />
              ))}
            </div>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading} className="w-100">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" onClick={handleResend} disabled={resendDisabled}>
            {resendDisabled ? 'Please wait before resending...' : 'Resend Code'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TwoStepVerification;
