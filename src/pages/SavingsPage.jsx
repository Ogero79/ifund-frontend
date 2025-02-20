import React, { useEffect, useState } from "react";
import { ProgressBar, Button, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import Header from "../components/Header";
import BottomNavigation from "../components/BottomNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const GoalCard = ({
  image,
  title,
  progress,
  target,
  remainingTime,
  viewGoalDetails,
}) => (
  <div
    className="goal-card p-4 rounded shadow-sm bg-light"
    style={{ width: "300px", flexShrink: 0 }}
  >
    <img
      src={image}
      alt={title}
      className="w-100 rounded mb-3"
      style={{ maxHeight: "200px", objectFit: "cover" }}
    />
    <h6 className="fw-bold">{title}</h6>
    <ProgressBar now={progress} className="my-2" style={{ height: "12px" }} />
    <p className="mb-1 text-muted" style={{ fontSize: "1rem" }}>
      Target: Ksh. {target}.00
    </p>
    <p className="mb-0 text-muted" style={{ fontSize: "1rem" }}>
      Time remaining: {remainingTime} month(s)
    </p>
    <Button
      variant="primary"
      className="mt-2"
      size="sm"
      onClick={viewGoalDetails}
    >
      View Goal
    </Button>
  </div>
);

const SavingsPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const storedUserName = localStorage.getItem("userName");
  const [allocatedFunds, setAllocatedFunds] = useState(0);
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    const fetchSavingsData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `https://ifund-backend.onrender.com/api/goals/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setAllocatedFunds(response.data.allocatedFunds || 0);
        const fetchedGoals = response.data.goals || [];
        setGoals(fetchedGoals);
      } catch (error) {
        console.error("Failed to fetch savings data:", error);
        setError("Unable to load savings data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavingsData();
  }, [navigate, token, role, storedUserName, userId]);

  const viewGoalDetails = (goalId) => {
    navigate(`/user/goal/${goalId}`);
  };

    if (loading) {
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
    <div className="savings-page py-4 px-3 px-md-5 px-lg-6 px-xl-7" >
      <Header userImage="https://placehold.co/50" userName={userName} />

      {!loading && error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}


        <>
          <section className="savings-summary mb-4 text-left d-flex justify-content-center align-items-center">
            <div
              className="border rounded-5 p-3 shadow-sm w-100 mx-auto"
              style={{
                borderColor: "#ddd",
                maxWidth: "100%",
                width: "95%",
                marginBottom: "40px",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                borderRadius: "15px",
                cursor: "pointer",
              }}
              onClick={() => navigate("/user/add-goal")}
            >
              <div
                className="text-left pe-3"
                style={{
                  flex: 1,
                  minWidth: "45%",
                  borderRight: "3px dotted #ddd",
                }}
              >
                <h3 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
                  Ksh. {allocatedFunds.toLocaleString()}
                </h3>
                <h5 className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Total Allocated Funds
                </h5>
              </div>
              <div
                className="text-left ps-3 position-relative"
                style={{
                  flex: 0.5,
                  minWidth: "40%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <h3 className="fw-bold mb-2" style={{ fontSize: "1.5rem" }}>
                  {goals.length}
                </h3>
                <h5 className="text-muted" style={{ fontSize: "0.9rem" }}>
                  Active Goals
                </h5>
                <Button
                  variant="primary"
                  className="position-absolute top-0 end-0 rounded-circle"
                  style={{
                    width: "40px",
                    height: "40px",
                    padding: 0,
                    fontSize: "1.5rem",
                    border: "none",
                  }}
                  onClick={() => navigate("/user/add-goal")}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>
          </section>
          <section className="select-goal mb-4">
            <h5 className="fw-bold mb-3">Select a Goal</h5>
            <div
              className="goals-container d-flex overflow-auto gap-3 py-2"
              style={{ marginBottom: "100px" }}
            >
              {goals.length > 0 ? (
                goals.map((goal) => (
                  <GoalCard
                    key={goal.goal_id}
                    image={goal.image_url}
                    title={goal.title}
                    progress={(goal.saved_amount / goal.target_amount) * 100}
                    target={goal.target_amount.toLocaleString()}
                    remainingTime={Math.ceil(
                      (new Date(goal.end_date) - new Date()) /
                        (1000 * 60 * 60 * 24 * 30)
                    )}
                    viewGoalDetails={() => viewGoalDetails(goal.goal_id)}
                  />
                ))
              ) : (
                <p className="text-center text-muted">
                  No active goals found. Start creating one!
                </p>
              )}
            </div>
          </section>
        </>


      <BottomNavigation />
    </div>
  );
};

export default SavingsPage;
