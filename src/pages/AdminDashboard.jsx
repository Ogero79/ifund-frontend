import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Form,
} from "react-bootstrap";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import axios from "axios";
import "../styles/AdminDashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
Chart.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Filler
);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [totalSupportMessages, setTotalSupportMessages] = useState(0);
  const [totalAccountInfoRequests, setTotalAccountInfoRequests] = useState(0);

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
    }

    const fetchTotals = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://newly-bright-chigger.ngrok-free.app/superadmin/totals",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotalUsers(response.data.totalUsers);

        const fetchedTotalSavings = response.data.totalSavings;
        setTotalSavings(fetchedTotalSavings);

        const fetchedTotalGoals = response.data.totalGoals;
        setTotalGoals(fetchedTotalGoals);

        const fetchedTotalFeedbacks = response.data.totalFeedbacks;
        setTotalFeedbacks(fetchedTotalFeedbacks);

        const fetchedTotalSupportMessages = response.data.totalSupportMessages;
        setTotalSupportMessages(fetchedTotalSupportMessages);

        const fetchedTotalAccountInfoRequests =
          response.data.totalAccountInfoRequests;
        setTotalAccountInfoRequests(fetchedTotalAccountInfoRequests);
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

  const [timeframe, setTimeframe] = useState("Month");
  const chartRef = useRef(null);

  // Data sets for different timeframes
  const dataSets = {
    Day: {
      labels: ["00:00", "06:00", "12:00", "18:00", "24:00"],
      values: [5, 12, 8, 15, 9],
    },
    Week: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [30, 45, 28, 50, 60, 35, 40],
    },
    Month: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      values: [150, 200, 180, 220],
    },
    Year: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      values: [
        800, 1200, 950, 1100, 1300, 1250, 1400, 1350, 1600, 1700, 1500, 1800,
      ],
    },
  };

  // Create a gradient background for the chart
  const getGradient = (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, "rgba(221, 230, 240, 0.8)"); // Dark Grey
    gradient.addColorStop(1, "rgba(95, 97, 100, 0.1)"); // Faded Gradient
    return gradient;
  };

  const [chartData, setChartData] = useState({
    labels: dataSets[timeframe].labels,
    datasets: [
      {
        label: "User Registrations",
        data: dataSets[timeframe].values,
        fill: true,
        backgroundColor: "rgba(26, 91, 121, 0.8)", // Default fallback color
        borderColor: "#4A90E2",
        tension: 0.4,
      },
    ],
  });

  useEffect(() => {
    if (!chartRef.current) return; // Ensure chartRef is not null

    const chartInstance = chartRef.current;
    if (!chartInstance.ctx) return; // Ensure chart instance has a context

    const ctx = chartInstance.ctx;
    const gradient = getGradient(ctx); // Create the gradient

    setChartData((prevData) => ({
      ...prevData,
      datasets: [
        {
          ...prevData.datasets[0],
          backgroundColor: gradient, // Apply the gradient
        },
      ],
    }));
  }, [timeframe, isSidebarOpen]); // Re-run when timeframe or sidebar state changes

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: { display: true },
      },
    },
  };

  const analyticsCardData = [
    {
      title: "Total Savings",
      value: totalUsers,
      icon: "bi bi-people",
      link: "/superadmin/users-list",
    },
    {
      title: "Saving Goals",
      value: totalSavings,
      icon: "bi bi-wallet2",
      link: "/superadmin/users-list",
    },
    {
      title: "Feedbacks",
      value: totalFeedbacks,
      icon: "bi bi-people",
      link: "/superadmin/users-list",
    },
    {
      title: "Support Inquiries",
      value: totalSupportMessages,
      icon: "bi bi-wallet2",
      link: "/superadmin/users-list",
    },
    {
      title: "Info Requests",
      value: totalAccountInfoRequests,
      icon: "bi bi-wallet2",
      link: "/superadmin/users-list",
    },
  ];

  const cardData = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: "bi bi-people",
      growth: "5.25%",
      growthType: "success",
      link: "/superadmin/users-list",
    },
    {
      title: "iFund Wallet",
      value: "KES. 0.00",
      icon: "bi bi-wallet2",
      growth: "5.25%",
      growthType: "success",
      link: "/superadmin/users-list",
    },
    {
      title: "Total Shares",
      value: "100,000",
      icon: "bi bi-people",
      growth: "5.25%",
      growthType: "success",
      link: "/superadmin/users-list",
    },
    {
      title: "Revenue",
      value: "KES. 0.00",
      icon: "bi bi-wallet2",
      growth: "-5.25%",
      growthType: "danger",
      link: "/superadmin/users-list",
    },
  ];
  return (
    <div className="dashboard-container">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "" : "expanded"}`}>
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        {loading ? (
          <div className="loader">
            <Spinner animation="border" role="status" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          <div className="mt-5">
            <h3>Dashboard</h3>
            <div
              className="d-flex flex-column flex-md-row gap-4 align-items-stretch mb-4"
              style={{ height: "60vh" }}
            >
              {/* Cards Container (50% Width, Same Height as Graph) */}
              <div
                className="dashboard-cards flex-grow-1 d-flex flex-column"
                style={{ width: "50%" }}
              >
                <Row className="g-3 h-100">
                  {cardData.map((card, index) => (
                    <Col key={index} xs={6}>
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
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <span className={`text-${card.growthType}`}>
                                <i className="mdi mdi-arrow-bottom-right"></i>{" "}
                                {card.growth}
                              </span>
                              <span style={{ color: "#bec1c5bf" }}>
                                {" "}
                                Since last week
                              </span>
                            </div>
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

              {/* Chart Container (50% Width, Same Height as Cards) */}
              <div
                className="chart-section flex-grow-1 d-flex flex-column h-100"
                style={{ width: "50%" }}
              >
                <Card className="h-100 user-performance-card d-flex flex-column">
                  <Card.Header className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0" style={{ fontSize: "1.1rem" }}>
                      User Registration Performance
                    </h5>
                    <Form.Select
                      size="sm"
                      className="w-auto"
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      style={{
                        minWidth: "80px",
                        backgroundColor: "#2d3846",
                        color: "#ddd",
                        border: "none",
                      }}
                    >
                      <option value="Day">Day</option>
                      <option value="Week">Week</option>
                      <option value="Month">Month</option>
                      <option value="Year">Year</option>
                    </Form.Select>
                  </Card.Header>
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center flex-grow-1">
                    <div
                      className="chart-container w-100"
                      style={{ minHeight: "250px" }}
                    >
                      <Line
                        ref={chartRef}
                        data={chartData}
                        options={chartOptions}
                      />
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>

            <h3>Other Analytics</h3>
          
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
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
