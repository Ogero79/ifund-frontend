import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Tab,
  Nav,
  Table,
  Spinner,
} from "react-bootstrap";
import {
  FaArrowUp,
  FaArrowDown,
  FaPercent,
  FaUserFriends,
} from "react-icons/fa";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import LatestTransactionCard from "../components/LatestTransactionCard";
import axios from "axios";

const UserHomepage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const [balance, setBalance] = useState("0.00");
  const [investmentData, setInvestmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const storedUserName = localStorage.getItem("userName");

  const storedTheme = localStorage.getItem("theme") || "light";
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

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `https://newly-bright-chigger.ngrok-free.app/api/accounts/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            withCredentials: true, // Must be included
          }
        );

        console.log(response.data);
        if (response.data && response.data.account) {
          setBalance(response.data.account.balance);
        } else {
          setBalance("Not Available");
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
        setBalance("Error");
      }
    };
    const fetchInvestmentPerformance = async () => {
      try {
        const response = await axios.get(
          `https://newly-bright-chigger.ngrok-free.app/api/interests/performance/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (response.data && response.data.performance) {
          setInvestmentData(response.data.performance);
        } else {
          setInvestmentData([]);
        }
      } catch (error) {
        console.error("Error fetching investment performance:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
    fetchInvestmentPerformance();
  }, [token, role, userId, navigate, storedUserName]);

  const navigationHandlers = {
    openTransactions: () => navigate("/user/transactions"),
    openDepositPage: () => navigate("/user/deposit"),
    openWithdrawPage: () => navigate("/user/withdraw"),
    openLoansPage: () => navigate("/user/loans"),
    openInviteFriendsPage: () => navigate("/invite"),
  };

  const renderInvestmentTable = (data) => (
    <Table striped bordered hover responsive size="sm">
      <thead>
        <tr>
          <th>Period</th>
          <th>Interest Earned (Ksh)</th>
          <th>Total Investment (Ksh)</th>
        </tr>
      </thead>
      <tbody>
        {data.length ? (
          data.map((row, index) => (
            <tr key={index}>
              <td>{row.period.replace(/(\d)(\w)/, "$1 $2")}</td>
              <td>{row.interest.toFixed(2)}</td>
              <td>{row.total.toFixed(2)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="3" className="text-center">
              No data available
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  if (userName === null || loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Spinner
          animation="border"
          role="status"
          variant="primary"
          style={{ width: "5rem", height: "5rem" }}
        >
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4 px-3 px-md-5 px-lg-6 px-xl-7">
      <Header userImage="https://via.placeholder.com/50" userName={userName} />

      <div
        className="border rounded-5 p-4 mx-auto mb-4 shadow-sm"
        style={{ maxWidth: "600px" }}
      >
        <h3 className="fw-bold fs-2 mb-3">Ksh. {balance}</h3>
        <h5 className="text-muted fs-6">Total Savings</h5>
      </div>

      <Row className="mb-5">
        <Col xs={12}>
          <div className="d-flex justify-content-between flex-wrap gap-2 mb-4">
            {[
              {
                label: "Deposit",
                icon: <FaArrowUp />,
                handler: navigationHandlers.openDepositPage,
                variant: "outline-success",
              },
              {
                label: "Withdraw",
                icon: <FaArrowDown />,
                handler: navigationHandlers.openWithdrawPage,
                variant: "outline-danger",
              },
              {
                label: "Loans",
                icon: <FaPercent />,
                handler: navigationHandlers.openLoansPage,
                variant: "outline-info",
              },
              {
                label: "Invite Friends",
                icon: <FaUserFriends />,
                handler: navigationHandlers.openInviteFriendsPage,
                variant: "outline-primary",
              },
            ].map((button, index) => (
              <Button
                key={index}
                variant={button.variant}
                className="d-flex align-items-center"
                onClick={button.handler}
              >
                {button.icon} <span className="ms-2">{button.label}</span>
              </Button>
            ))}
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>TRANSACTIONS</h5>
            <Button
              variant="link"
              className="p-0"
              onClick={navigationHandlers.openTransactions}
            >
              SEE ALL
            </Button>
          </div>

          <LatestTransactionCard />
        </Col>
      </Row>

      <div style={{ marginBottom: "100px" }}>
        <h5>INVESTMENT PERFORMANCE</h5>
        <Tab.Container defaultActiveKey="3months">
          <Nav variant="pills" className="flex-wrap mb-3">
            {["3months", "6months", "1year", "2years"].map((key, index) => (
              <Nav.Item key={index}>
                <Nav.Link eventKey={key}>
                  {key.replace(/(\d)(\w)/, "$1 $2")}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          <Tab.Content>
            {["3months", "6months", "1year", "2years"].map((key, index) => (
              <Tab.Pane eventKey={key} key={index}>
                {renderInvestmentTable(
                  investmentData.filter((item) => item.period === key)
                )}
              </Tab.Pane>
            ))}
          </Tab.Content>
        </Tab.Container>
      </div>

      <BottomNavigation />
    </Container>
  );
};

export default UserHomepage;
