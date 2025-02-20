import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import BottomNavigation from '../components/BottomNavigation';
import { Card, Button } from 'react-bootstrap';

const Communities = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null); 
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem('authToken');
  const role = localStorage.getItem('userRole');
  const storedUserName = localStorage.getItem("userName");
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
    if (storedUserName) {
      const firstName = storedUserName.split(" ")[0];
      setUserName(firstName);
    }
  }, [token, role, userId, navigate]);

  return (
    <div className="communities-page-container container-fluid py-4 px-3 px-md-4 px-lg-5 flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Header userImage="https://placehold.co/50" userName={userName} />
      <div className="flex flex-col items-center text-center p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Communities Feature Coming Soon!</h2>
          <p className="text-gray-600 mb-4">We are working hard to bring you an amazing communities experience. Stay tuned for updates!</p>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default Communities;
