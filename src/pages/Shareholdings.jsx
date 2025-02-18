import React, { useState, useEffect } from "react";
import { Container, Card, Button, Modal, Alert, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { useNavigate } from "react-router-dom";

const Shareholdings = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  
  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
    }

    const fetchTotals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://ifund-backend.onrender.com/superadmin/totals",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalUsers(response.data.totalUsers);

        const fetchedTotalSavings = response.data.totalSavings;
        setTotalSavings(fetchedTotalSavings);
      } catch (error) {
        setError("Unable to load users data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [token, role, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const analyticsCardData = [
    {
      title: "Total Shares",
      value: totalUsers,
      icon: "bi bi-people",
      link: "/superadmin/users-list",
    },
    {
      title: "Bought Shares",
      value: totalUsers,
      icon: "bi bi-wallet2",
      link: "/superadmin/users-list",
    },
    {
      title: "Share Price",
      value: totalSavings,
      icon: "bi bi-wallet2",
      link: "/superadmin/users-list",
    },
  ];

  return (
    <div>
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "" : "expanded"} mt-5`}>
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <h5>Shareholdings Performance</h5>
       <div className="other-analytics-cards flex-grow-1 d-flex flex-column">
              <Row className="g-3 h-100">
                {analyticsCardData.map((card, index) => (
                  <Col key={index} xs={3}>
                    <Card className="total-users-card h-100">
                      <Card.Body className="d-flex flex-column justify-content-between">
                        {/* Title and Icon */}
                        <div className="card-header d-flex align-items-center">
                          <div className="icon-container text-primary me-2">
                            <i className={card.icon}></i>
                          </div>
                          <Card.Title
                            className="card-title"
                            style={{ fontSize: "1.1rem" }}
                          >
                            {card.title}
                          </Card.Title>
                        </div>

                        {/* Value */}
                        <h2
                          className="mt-2 mb-2"
                          style={{ fontSize: "1.3rem" }}
                        >
                          {card.value}
                        </h2>

                        {/* Growth Percentage */}
                        <div className="d-flex justify-content-between align-items-center mt-5">
                          <div
                            className="navigate-icon"
                            onClick={() => navigate(card.link)}
                          >
                            <i className="bi bi-arrow-right"></i>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

      <div className="mt-5">
        <h5>Shareholders</h5>
      </div>
      </div>
    </div>
  );
};

export default Shareholdings;
