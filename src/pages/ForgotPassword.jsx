import React, { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage('A password reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ maxWidth: '400px', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h2 className="text-center">Forgot Password</h2>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </Form.Group>
          <Button type="submit" className="w-100" style={{ backgroundColor: '#1FC17B' }} disabled={loading}>
            {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Send Reset Link'}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
