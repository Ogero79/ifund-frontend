import React, { useState, useEffect } from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSun, FaMoon } from 'react-icons/fa'; 

const Theme = () => {
  const storedTheme = localStorage.getItem('theme') || 'light';
  const [theme, setTheme] = useState(storedTheme);
  const navigate = useNavigate();
  useEffect(() => {
    document.body.className = theme; 
    localStorage.setItem('theme', theme);
  }, [theme]);
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Container className="my-4 px-3">
      <div className="d-flex align-items-center mb-4">
    <Button variant="link" onClick={() => navigate(-1)} className="p-0 me-3" style={{ color: 'black' }}>
      <i className="bi bi-arrow-left back-btn" style={{ fontSize: '2rem' }}></i>
    </Button>
        <h2 className="mb-0">Theme Settings</h2>
      </div>

      <div className="d-flex justify-content-center align-items-center mt-5">
        <Button
          variant="outline-secondary"
          className={`theme-toggle-btn theme-${theme}`}
          onClick={toggleTheme}
        >
          {theme === 'light' ? <FaMoon size={24} /> : <FaSun size={24} />}
          <span className="ms-2">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </Button>
      </div>
    </Container>
  );
};

export default Theme;
