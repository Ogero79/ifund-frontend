import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  ProgressBar,
  Card,
  Container,
  Row,
  Col,
  Modal,
  Form,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import axios from "axios";

const GoalDetailPage = () => {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editGoal, setEditGoal] = useState({
    title: "",
    description: "",
    target: "",
    image: "",
  });
  const [goalImage, setGoalImage] = useState("");
  const [goalRole, setGoalRole] = useState("");
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [members, setMembers] = useState([]);
  const [membersCount, setMembersCount] = useState(0);
  const [newMember, setNewMember] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showContributeModal, setShowContributeModal] = useState(false);
  const [contributionAmount, setContributionAmount] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [balance, setBalance] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const userId = localStorage.getItem("userId");
  const [showAddMemberInput, setShowAddMemberInput] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [amount, setAmount] = useState("");

  const storedTheme = localStorage.getItem("theme") || "light";
  const theme = storedTheme;
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const fetchGoalDetails = async () => {
    try {
      setLoading(true);
      if (!userId) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `https://ifund-backend.onrender.com/api/goal/${goalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            userId,
          },
        }
      );

      const goalData = response.data.goal;
      setGoal(goalData);

      const userGoalRole = goalData.goalRole;

      setEditGoal({
        title: goalData.title,
        description: goalData.description,
        target: goalData.target_amount,
        image: goalData.image_path,
        end_date: goalData.end_date,
      });

      setMembers(
        goalData.members.map((member) => ({
          userId: member.user_id,
          savedAmount: member.saved_amount,
          joinedAt: new Date(member.joined_at).toLocaleDateString(),
          goalRole: member.goal_role,
        }))
      );

      setGoalRole(userGoalRole);
    } catch (error) {
      console.error("Error fetching goal details:", error);
      setError("Goal not found.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (goalId) => {
    setShowDeleteModal(true);
  };

  const handleDeleteGoal = async () => {
    try {
      const response = await fetch(
        `https://ifund-backend.onrender.com/api/goals/${goalId}/delete`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete goal");
      }
      navigate("/user/savings");
    } catch (error) {
      console.error(error);
      alert("Error deleting goal");
    }
  };

  useEffect(() => {
    if (!token || role !== "user") {
      navigate("/login");
      return;
    }
    const fetchGoalDetails = async () => {
      try {
        setLoading(true);

        if (!userId) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `https://ifund-backend.onrender.com/api/goal/${goalId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: {
              userId,
            },
          }
        );

        const goalData = response.data.goal;
        setGoal(goalData);

        const userGoalRole = goalData.goalRole;

        setEditGoal({
          title: goalData.title,
          description: goalData.description,
          target: goalData.target_amount,
          image: goalData.image_url,
          end_date: goalData.end_date,
        });

        setMembers(
          goalData.members.map((member) => ({
            userId: member.user_id,
            name: member.full_name,
            profile_picture: member.profile_picture,
            contribution: member.contribution,
            joinedAt: new Date(member.joined_at).toLocaleDateString(),
            goalRole: member.goal_role,
          }))
        );

        setMembersCount(goalData.memberCount);
        setGoalRole(userGoalRole);
      } catch (error) {
        console.error("Error fetching goal details:", error);
        setError("Goal not found.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `https://ifund-backend.onrender.com/api/accounts/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
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

    fetchAccountDetails();
    fetchGoalDetails();
  }, [goalId]);

  const handleEditGoal = async () => {
    const formData = new FormData();
    formData.append("title", editGoal.title);
    formData.append("description", editGoal.description);
    formData.append("target_amount", editGoal.target);
    formData.append("end_date", editGoal.end_date);
    if (goalImage) {
      formData.append("image", goalImage);
    }

    try {
      const response = await axios.put(
        `https://ifund-backend.onrender.com/api/goals/${goalId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setGoal(response.data.goal);
      setShowEditModal(false);
      fetchGoalDetails();
    } catch (error) {
      console.error("Error updating goal:", error);
      setError("Error updating goal.");
    }
  };

  const handleAddMember = async () => {
    if (!newMember) {
      alert("Please enter a member ID.");
      return;
    }

    try {
      const response = await axios.post(
        `https://ifund-backend.onrender.com/api/goals/${goalId}/members`,
        { userId: newMember },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Member added successfully!");
        const newMemberData = response.data.member;

        setMembers((prevMembers) => [
          ...prevMembers,
          {
            userId: newMemberData.user_id,
            name: newMemberData.full_name,
            savedAmount: 0.00,
            joinedAt: new Date().toLocaleDateString(),
            goalRole: "member",
          },
        ]);
        setMembersCount((prevCount) => prevCount + 1);
        setNewMember("");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert(
        error.response?.data?.error || "Failed to add member. Please try again."
      );
    }
  };

  const calculateTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diffInMs = end - now;

    if (diffInMs <= 0) return "Expired";

    const days = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? "s" : ""}`;
    if (months > 0) return `${months} month${months > 1 ? "s" : ""}`;
    return `${days} day${days > 1 ? "s" : ""}`;
  };

  const handleContributionChange = (amount) => {
    const parsedAmount = parseFloat(amount);
    setContributionAmount(isNaN(parsedAmount) ? "" : parsedAmount);
  };

  const handleContribute = async () => {
    if (contributionAmount <= 0 || contributionAmount > balance) {
      alert("Invalid contribution amount. Please check your balance.");
      return;
    }

    try {
      const response = await axios.post(
        `https://ifund-backend.onrender.com/api/goals/${goal.goal_id}/contribute`,
        {
          userId: localStorage.getItem("userId"),
          contributionAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Contribution successful!");

        const updatedGoal = {
          ...goal,
          saved_amount: parseFloat(goal.saved_amount) + contributionAmount,
        };
        setGoal(updatedGoal);
        setBalance((prevBalance) => prevBalance - contributionAmount);

        const updatedMembers = members.map((member) => {
          if (member.userId === localStorage.getItem("userId")) {
            return {
              ...member,
              contribution:
                parseFloat(member.contribution || 0) + contributionAmount,
            };
          }
          return member;
        });
        setMembers(updatedMembers);

        setShowContributeModal(false);
        setContributionAmount("");
        setErrorMessage("");
      }
    } catch (error) {
      console.error("Error contributing to goal:", error);
      setErrorMessage(
        error.response?.data?.error || "Failed to contribute. Please try again."
      );
    }
  };

  const handleRemoveMember = async (userId) => {
    try {
      const response = await axios.delete(
        `https://ifund-backend.onrender.com/api/goals/${goalId}/members/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m.userId !== userId)
        );
        setMemberToRemove(null);
        setMembersCount((prevCount) => prevCount - 1);
        alert("Member removed successfully!");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member. Please try again.");
    }
  };

  const handleLeaveGoal = async () => {
    try {
      const response = await axios.delete(
        `https://ifund-backend.onrender.com/api/goals/${goalId}/members/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setMembers((prevMembers) =>
          prevMembers.filter((m) => m.userId !== userId)
        );
        setMemberToRemove(null);
        alert("You have left the goal successfully!");
        navigate("/user/savings");
      }
    } catch (error) {
      console.error("Error leaving goal:", error);
      alert("Failed to leave the goal. Please try again.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGoalImage(file);
    }
  };

  const handleWithdraw = async () => {
    setError(""); // Clear previous errors

    // Convert amount to number and validate
    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (withdrawAmount > goal.saved_amount) {
      setError("Insufficient balance.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `https://ifund-backend.onrender.com/api/goal/${goalId}/withdraw`,
        {
          amount: withdrawAmount,
          userId,
        }
      );

      alert(response.data.message);
      setAmount("");
      fetchGoalDetails();
    } catch (err) {
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="modern-loader">
          <Spinner
            animation="border"
            role="status"
            variant="primary"
            style={{ width: "4rem", height: "4rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <div className="loading-text">Please wait...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!goal) {
    return <div>Loading goal data...</div>;
  }

  const progressPercentage =
    goal.saved_amount && goal.target_amount
      ? Math.min((goal.saved_amount / goal.target_amount) * 100, 100)
      : 0;

  return (
    <Container className="py-4">
      <div className="d-flex align-items-center mb-4">
        <Button
          variant="link"
          onClick={() => navigate(-1)}
          className="p-0 me-3"
          style={{ color: "black" }}
        >
          <i
            className="bi bi-arrow-left back-btn"
            style={{ fontSize: "2rem" }}
          ></i>
        </Button>
        <h2 className="mb-0">Goal Details</h2>
      </div>
      <Container>
        <Row className="justify-content-center">
          <Col md={8}>
            <Card
              className="shadow-lg p-4 position-relative"
              style={{
                borderRadius: "15px",
                overflow: "hidden",
                backgroundColor: "#fff",
              }}
            >
              <Card.Body className="text-dark">
                <div className="position-relative mb-3">
                  <img
                    src={goal.image_url}
                    alt={goal.title}
                    className="w-100 rounded-3"
                    style={{
                      maxHeight: "350px",
                      objectFit: "cover",
                      borderRadius: "15px",
                    }}
                  />

                  {(() => {
                    return (
                      <>
                        {goalRole === "admin" &&
                          goal.target_amount - goal.saved_amount > 0 && (
                            <Button
                              variant="light"
                              className="position-absolute top-0 end-0 m-2 shadow-lg"
                              onClick={() => setShowEditModal(true)}
                              style={{
                                borderRadius: "50%",
                                padding: "12px",
                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                                backdropFilter: "blur(10px)",
                                backgroundColor: "rgba(255, 255, 255, 0.3)",
                                border: "none",
                              }}
                            >
                              ✏️
                            </Button>
                          )}
                        {goalRole === "admin" && (
                          <button
                            className="position-absolute top-0 start-0 m-2 shadow-lg btn btn-light"
                            style={{
                              borderRadius: "50%",
                              padding: "12px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                              backdropFilter: "blur(10px)",
                              backgroundColor: "rgba(255, 255, 255, 0.3)",
                              border: "none",
                            }}
                            onClick={() => handleDeleteClick(goal.id)}
                          >
                            🗑️
                          </button>
                        )}
                      </>
                    );
                  })()}
                </div>

                <h3 className="fw-bold mb-2">{goal.title}</h3>
                <p className="text-muted mb-3">{goal.description}</p>

                <ProgressBar
                  now={progressPercentage}
                  label={`${progressPercentage.toFixed(2)}%`}
                  className="my-3"
                  style={{
                    height: "15px",
                    borderRadius: "10px",
                    background: "#e0e0e0",
                  }}
                />

                <div className="mb-3">
                  {goal.target_amount - goal.saved_amount <= 0 ? (
                    <div>
                      <p
                        className="fw-bold text-success mb-1"
                        style={{ fontSize: "1.2rem" }}
                      >
                        Goal Completed! 🎉
                      </p>
                      <p
                        className="fw-bold  mb-1"
                        style={{ fontSize: "1.2rem" }}
                      >
                        Delete the goal in order to add the funds to your
                        withdrawable balance
                      </p>
                    </div>
                  ) : (
                    <>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Target: Ksh. {goal.target_amount || "0"}
                      </p>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Saved: Ksh. {goal.saved_amount}
                      </p>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Remaining: Ksh. {goal.target_amount - goal.saved_amount}
                      </p>
                      <p
                        className="mb-1 text-muted"
                        style={{ fontSize: "1.1rem" }}
                      >
                        Time Remaining: {calculateTimeRemaining(goal.end_date)}
                      </p>
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  {/* Show Members Button */}
                  <Button
                    variant="outline-dark"
                    size="sm"
                    onClick={() => setShowMembersModal(true)}
                    className="px-3 py-2"
                    style={{
                      borderRadius: "50px",
                      borderColor: "#333",
                      color: "#333",
                      fontSize: "0.9rem",
                    }}
                  >
                    Show Members
                  </Button>

                  {/* Contribute Button */}
                  {goal.target_amount - goal.saved_amount > 0 && (
                    <Button
                      variant="light"
                      size="lg"
                      onClick={() => setShowContributeModal(true)}
                      className="px-4 py-2 shadow-sm"
                      style={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: "50px",
                        border: "none",
                        color: "#333",
                        transition: "background 0.3s ease-in-out",
                      }}
                    >
                      Contribute <i className="bi bi-arrow-up-right-circle"></i>
                    </Button>
                  )}

                  {/* Withdraw Button - Only Show if Funds are Available */}
                  {goal.saved_amount > 0 && goalRole == 'admin' && (
                    <Button
                      variant="success"
                      size="lg"
                      onClick={() => setShowWithdrawModal(true)}
                      className="px-4 py-2 shadow-sm"
                      style={{
                        borderRadius: "50px",
                        border: "none",
                        color: "#fff",
                        backgroundColor: "#28a745",
                        transition: "background 0.3s ease-in-out",
                      }}
                    >
                      Withdraw <i className="bi bi-arrow-down-circle"></i>
                    </Button>
                  )}
                </div>
              </Card.Body>
              <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
              >
                <Modal.Header closeButton>
                  <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  Are you sure you want to delete this goal?
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowDeleteModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button variant="danger" onClick={handleDeleteGoal}>
                    Delete
                  </Button>
                </Modal.Footer>
              </Modal>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGoalTitle">
              <Form.Label>Goal Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter goal title"
                value={editGoal.title}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, title: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGoalDescription">
              <Form.Label>Goal Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter goal description"
                value={editGoal.description}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, description: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGoalSavedAmount">
              <Form.Label>Saved Amount</Form.Label>
              <Form.Control
                type="text"
                value={goal.saved_amount}
                readOnly
                disabled
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGoalTarget">
              <Form.Label>Target Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter target amount"
                value={editGoal.target}
                onChange={(e) => {
                  const targetValue = parseFloat(e.target.value);
                  setEditGoal((prevGoal) => ({
                    ...prevGoal,
                    target: targetValue,
                    error: targetValue < goal.saved_amount,
                  }));
                }}
              />
              {editGoal.error && (
                <Form.Text className="text-danger">
                  Target amount must be greater than or equal to the saved
                  amount.
                </Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGoalEndDate">
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                value={editGoal.end_date}
                onChange={(e) =>
                  setEditGoal({ ...editGoal, end_date: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Goal Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            <Button
              variant="primary"
              onClick={handleEditGoal}
              disabled={editGoal.error}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showContributeModal}
        onHide={() => setShowContributeModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Contribute to Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col xs={12}>
                <h5>
                  Balance: {balance !== null ? `KES ${balance}` : "Loading..."}
                </h5>
                <h5>
                  Remaining: Ksh. {goal.target_amount - goal.saved_amount}
                </h5>
              </Col>
            </Row>
            <Form.Group>
              <Form.Label>Contribution Amount (KES)</Form.Label>
              <Form.Control
                type="number"
                value={contributionAmount}
                onChange={(e) => handleContributionChange(e.target.value)}
                isInvalid={
                  contributionAmount > balance || contributionAmount <= 0
                }
              />
              {errorMessage && (
                <small className="text-danger">{errorMessage}</small>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowContributeModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleContribute}
            disabled={contributionAmount > balance || contributionAmount <= 0}
          >
            Contribute
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showWithdrawModal}
        onHide={() => setShowWithdrawModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Withdraw Funds</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {/* Informational Message */}
          <p className="text-muted">
            The amount you withdraw will be added to your Savings balance. You
            can manage these funds from your account.
          </p>

          {/* Amount Input */}
          <Form.Group className="mb-3">
            <Form.Label>Amount to Withdraw</Form.Label>
            <Form.Control
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Available: ${goal.saved_amount}`}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowWithdrawModal(false)}
          >
            Cancel
          </Button>
          <Button variant="success" onClick={handleWithdraw} disabled={loading}>
            {loading ? "Processing..." : "Confirm Withdrawal"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showMembersModal} onHide={() => setShowMembersModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Goal Members</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <h5 className="mb-3">{membersCount} members</h5>
    {goalRole === "admin" && (
      <Button
        variant="link"
        className="d-flex mb-4 p-0 text-primary gap-3 justify-content-center align-items-center"
        title="Add Member"
        onClick={() => setShowAddMemberInput((prev) => !prev)}
        style={{ textDecoration: "none" }}
      >
        <div
          className="rounded-circle d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "#43A047",
            width: "40px",
            height: "40px",
          }}
        >
          <i
            className="bi bi-person-plus"
            style={{ fontSize: "1.5rem", color: "white" }}
          ></i>
        </div>
        <span style={{ color: "black" }}>Add members</span>
      </Button>
    )}
    {goalRole === "admin" && showAddMemberInput && (
      <div className="mb-4">
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleAddMember();
          }}
        >
          <Form.Group
            className="d-flex align-items-center"
            controlId="formAddMember"
          >
            <Form.Control
              type="text"
              placeholder="Enter member User ID"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
            <Button variant="primary" type="submit" className="ms-2">
              Add
            </Button>
          </Form.Group>
        </Form>
      </div>
    )}
    {members.length > 0 ? (
      <ListGroup>
        {[...members]
          .sort((a, b) => {
            if (a.userId === userId) return -1;
            if (b.userId === userId) return 1;
            if (a.goalRole === "admin") return -1;
            if (b.goalRole === "admin") return 1;
            return 0;
          })
          .map((member, index) => (
            <ListGroup.Item
              key={index}
              className="d-flex justify-content-between align-items-center"
            >
              <div>
                <img
                  src={
                    member.profile_picture ||
                    "https://placehold.co/50"
                  }
                  className="rounded-circle"
                  style={{ width: 60, height: 60, objectFit: "cover" }}
                />
                {member.userId === userId ? (
                  <strong>You</strong>
                ) : (
                  <strong>{member.name}</strong>
                )}
                <br />
                <span>Contribution: {member.contribution}</span> <br />
                <small>
                  Joined: {new Date(member.joinedAt).toLocaleDateString()}
                </small>
              </div>
              {member.goalRole === "admin" ? (
                <span
                  className="badge"
                  style={{
                    backgroundColor: "#DCEDC8",
                    color: "#004d40",
                    padding: "10px 15px",
                  }}
                >
                  Admin
                </span>
              ) : member.userId === userId ? (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setMemberToRemove(member)}
                >
                  Leave
                </Button>
              ) : goalRole === "admin" ? (
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => setMemberToRemove(member)}
                >
                  Remove
                </Button>
              ) : null}
            </ListGroup.Item>
          ))}
      </ListGroup>
    ) : (
      <p className="text-muted text-center">
        No members yet. Click the icon to add members.
      </p>
    )}
  </Modal.Body>
  <Modal show={!!memberToRemove} onHide={() => setMemberToRemove(null)}>
    <Modal.Header closeButton>
      <Modal.Title>
        {memberToRemove?.userId === userId
          ? "Confirm Leave"
          : "Confirm Removal"}
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Are you sure you want to{" "}
      {memberToRemove?.userId === userId
        ? "leave this goal"
        : `remove ${memberToRemove?.name}`}
      ?
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={() => setMemberToRemove(null)}>
        Cancel
      </Button>
      <Button
        variant="danger"
        onClick={() =>
          memberToRemove?.userId === userId
            ? handleLeaveGoal()
            : handleRemoveMember(memberToRemove?.userId)
        }
      >
        {memberToRemove?.userId === userId ? "Leave" : "Remove"}
      </Button>
    </Modal.Footer>
  </Modal>
</Modal>

    </Container>
  );
};

export default GoalDetailPage;
