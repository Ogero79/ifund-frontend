import React, { useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await axios.post('https://newly-bright-chigger.ngrok-free.app/api/login', {
        email: formData.email,
        password: formData.password,
      });
      const { token, user } = response.data;

      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', user.name);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('userRole', user.role);

      navigate(user.role === 'superadmin' ? '/admin/dashboard' : '/user/home', { state: { userName: user.name } });

    } catch (error) {
      console.error('Login Error:', error);
      setError(error.response?.data?.message || 'An error occurred while logging in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '12px' }}>
        <div className="text-center">
          <h1 style={{ color: '#1FC17B', fontWeight: 700, fontSize: '36px' }}>iFund</h1>
        </div>
        <h2 className="text-center mt-3 mb-4">Login</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </Form.Group>

          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </Form.Group>

          {/* Forgot Password Link */}
          <div className="text-end mb-3">
            <a href="/forgot-password" style={{ color: '#1FC17B', fontSize: '14px', textDecoration: 'none' }}>
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-100"
            style={{ backgroundColor: '#1FC17B', borderColor: '#1FC17B' }}
            disabled={loading}
          >
            {loading ? (
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            ) : (
              'Login'
            )}
          </Button>
        </Form>

        {/* Sign-up Link */}
        <p className="text-center mt-3">
          Don't have an account?{' '}
          <a href="/register/step-1" style={{ color: '#1FC17B', fontWeight: 'bold', textDecoration: 'none' }}>
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
