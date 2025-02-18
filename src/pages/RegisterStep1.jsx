import React, { useState, useEffect } from "react";
import { Button, Form, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const RegisterStep1 = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error
    formData.referralCode = queryParams.get('ref'); 

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill out all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://newly-bright-chigger.ngrok-free.app/api/register/step1", {
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        ref: formData.referralCode,
      });
      const { userId, message } = response.data;
      localStorage.setItem('userId', userId);
      navigate("/register/step-2", { state: { userId } });
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-start"
        style={{ minHeight: "100vh", marginTop: "150px" }}
      >
        <div
          className="w-100"
          style={{
            maxWidth: "600px",
            padding: "2rem",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
          }}
        >
                  <div className="text-center">
          <h1 style={{ color: '#1FC17B', fontWeight: 700, fontSize: '36px' }}>iFund</h1>
        </div>
          <h2 className="text-center mb-4">
            Register - Step 1: Personal Information
          </h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFullName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleBack}>
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                style={{ backgroundColor: "#1FC17B", borderColor: "#1FC17B" }}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Next"}
              </Button>
            </div>
          </Form>
          <Form.Text className="text-center mt-3">
            Already have an account?{" "}
            <a href="/login" style={{ color: "#1FC17B" }}>
              Login here
            </a>
          </Form.Text>
        </div>
      </div>
    </>
  );
};

export default RegisterStep1;
