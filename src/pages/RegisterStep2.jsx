import React, { useState, useEffect } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const RegisterStep2 = () => {
  const [files, setFiles] = useState({
    frontId: null,
    backId: null,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/register/step-1');
    } else {
      if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', userId);
      }
    }
  }, [userId, navigate]);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFiles((prevFiles) => ({ ...prevFiles, [name]: files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
  
    if (!files.frontId || !files.backId) {
      setError('Please upload both the front and back of your ID.');
      return;
    }
  
    const formData = new FormData();
    formData.append('front_id', files.frontId); 
    formData.append('back_id', files.backId);  
    formData.append('userId', userId);         
  
    try {
      setLoading(true);
      const response = await axios.post('https://newly-bright-chigger.ngrok-free.app/api/register/step2', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
  
      if (response.status === 201) {
        navigate('/register/step-3', { state: { userId } }); 
      }
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('There was an error uploading your files. Please try again.');
      console.log(formData);
      console.log(userId);
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
        <div className="w-100" style={{ maxWidth: '600px', padding: '2rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <div className="text-center">
          <h1 style={{ color: '#1FC17B', fontWeight: 700, fontSize: '36px' }}>iFund</h1>
        </div>
          <h2 className="text-center mb-4">Register - Step 2: Upload Your ID</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFrontId">
              <Form.Label>Upload Front of ID</Form.Label>
              <Form.Control
                type="file"
                name="frontId"
                onChange={handleFileChange}
                required
                style={{ marginBottom: '1.5rem' }}
              />
            </Form.Group>
            <Form.Group controlId="formBackId">
              <Form.Label>Upload Back of ID</Form.Label>
              <Form.Control
                type="file"
                name="backId"
                onChange={handleFileChange}
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
                style={{
                  backgroundColor: '#1FC17B',
                  borderColor: '#1FC17B',
                }}
                disabled={loading}
              >
                {loading ? 'Uploading...' : 'Next'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default RegisterStep2;
