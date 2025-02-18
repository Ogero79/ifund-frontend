import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import AdminNavbar from "../components/AdminNavbar";
import axios from "axios";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalSavings, setTotalSavings] = useState(0);
  const [totalActiveUsers, setTotalActiveUsers] = useState(0);
  const [totalInactiveUsers, setTotalInactiveUsers] = useState(0);
  const [totalIncompleteRegistrations, setTotalIncompleteRegistrations] = useState(0);
  const [totalGoals, setTotalGoals] = useState(0);
  const [totalDeleteRequests, setTotalDeleteRequests] = useState(0);
  const [totalFeedbacks, setTotalFeedbacks] = useState(0);
  const [totalSupportMessages, setTotalSupportMessages] = useState(0);
  const [totalAccountInfoRequests, setTotalAccountInfoRequests] = useState(0);
  const [totalLoanRequests, setTotalLoanRequests] = useState(0);

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

        const fetchedTotalUsers = response.data.totalUsers;
        setTotalUsers(fetchedTotalUsers);

        const fetchedTotalSavings = response.data.totalSavings;
        setTotalSavings(fetchedTotalSavings);

        const fetchedTotalActiveUsers = response.data.totalActiveUsers;
        setTotalActiveUsers(fetchedTotalActiveUsers);

        const fetchedTotalInactiveUsers = response.data.totalInactiveUsers;
        setTotalInactiveUsers(fetchedTotalInactiveUsers);

        const fetchedTotalIncompleteRegistrations = response.data.totalIncompleteRegistrations;
        setTotalIncompleteRegistrations(fetchedTotalIncompleteRegistrations);

        const fetchedTotalGoals = response.data.totalGoals;
        setTotalGoals(fetchedTotalGoals);

        const fetchedTotalDeleteRequests = response.data.totalDeleteRequests;
        setTotalDeleteRequests (fetchedTotalDeleteRequests);

        const fetchedTotalFeedbacks = response.data.totalFeedbacks;
        setTotalFeedbacks (fetchedTotalFeedbacks);

        const fetchedTotalSupportMessages = response.data.totalSupportMessages;
        setTotalSupportMessages (fetchedTotalSupportMessages);

        const fetchedTotalAccountInfoRequests = response.data.totalAccountInfoRequests;
        setTotalAccountInfoRequests (fetchedTotalAccountInfoRequests);

        const fetchedTotalLoanRequests = response.data.totalLoanRequests;
        setTotalLoanRequests (fetchedTotalLoanRequests);

      } catch (error) {
        console.error("Failed to fetch users data:", error);
        setError("Unable to load users data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [token, role, navigate]);

  return (
    <div>
      
      <AdminNavbar />
      {loading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "100vh" }}
        >
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      {!loading && !error && (
      <Container className="mt-5">
        <Row>
          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Total Users</Card.Title>
                <Card.Text>{totalUsers}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/superadmin/users-list")}
                >
                  View All Users
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Active Users</Card.Title>
                <Card.Text>{totalActiveUsers}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/superadmin/active-users-list")}
                >
                  View Active Users
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Inactive Users</Card.Title>
                <Card.Text>{totalInactiveUsers}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate("/superadmin/inactive-users-list")}
                >
                  View Inactive Users
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Incomplete Registrations</Card.Title>
                <Card.Text>{totalIncompleteRegistrations}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/incomplete-registrations")
                  }
                >
                  View Incomplete Registrations
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Saving Goals</Card.Title>
                <Card.Text>{totalGoals}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/saving-goals")
                  }
                >
                  View Saving Goals
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Delete Requests</Card.Title>
                <Card.Text>{totalDeleteRequests}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/delete-requests")
                  }
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Feedbacks</Card.Title>
                <Card.Text>{totalFeedbacks}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/feedbacks")
                  }
                >
                  Manage Feedbacks
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Support Inquiries</Card.Title>
                <Card.Text>{totalSupportMessages}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/support-messages")
                  }
                >
                  Manage Inquiries
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Account Info Requests</Card.Title>
                <Card.Text>{totalAccountInfoRequests}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/account-info-requests")
                  }
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Total Savings</Card.Title>
                <Card.Text>
                  {totalSavings}
                </Card.Text>
                <Button variant="primary">View Savings</Button>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card>
              <Card.Body>
                <Card.Title>Loan Requests</Card.Title>
                <Card.Text>{totalLoanRequests}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() =>
                    navigate("/superadmin/loan-requests")
                  }
                >
                  Manage Requests
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      )}
    </div>
  );
};

export default AdminDashboard;
