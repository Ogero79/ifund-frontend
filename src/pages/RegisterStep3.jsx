import React, { useState, useEffect } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterStep3 = () => {
  const [formData, setFormData] = useState({
    agreeToTerms: false,
    consentToProcessing: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    
    if (!userId) {
      navigate('/register/step-2');
    } 
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms || !formData.consentToProcessing) {
      setError('You must agree to the terms and conditions and consent to the processing of personal data.');
      return;
    }

    const payload = {
      userId: userId,
      termsAccepted: formData.agreeToTerms,
      privacyPolicyAccepted: formData.consentToProcessing,
    };

    setLoading(true);
    try {
      const response = await axios.post('https://ifund-backend.onrender.com/api/register/step3', payload);
      

      if (response.status === 200 || response.status === 201) {
        navigate('/register/step-4');
      } else {
        setError('There was an error submitting your consent. Please try again.');
      }
    } catch (error) {
      console.error("Error occurred:", error);  
      setError(error.response?.data?.message || 'There was an error submitting your consent. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
        <div
          className="w-100"
          style={{ maxWidth: '600px', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}
        >
                  <div className="text-center">
          <h1 style={{ color: '#1FC17B', fontWeight: 700, fontSize: '36px' }}>iFund</h1>
        </div>

          <h2 className="text-center mb-4">Register - Step 3: Terms and Conditions</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formAgreeToTerms">
              <Form.Check
                type="checkbox"
                name="agreeToTerms"
                label="I agree to the terms and conditions."
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                style={{ marginBottom: '1.5rem' }}
              />
            </Form.Group>

            <Form.Group controlId="formConsentToProcessing">
              <Form.Check
                type="checkbox"
                name="consentToProcessing"
                label="I consent to the processing of my personal data."
                checked={formData.consentToProcessing}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Text className="text-muted">
              View our <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>.
            </Form.Text>

            <div className="d-flex justify-content-between mt-3">
              <Button variant="secondary" onClick={handleBack} disabled={loading}>
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#1FC17B',
                  borderColor: '#1FC17B',
                }}
              >
                {loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : 'Next'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegisterStep3;
