import React, { useState, useEffect } from "react";
import { Container, Card, Button, Modal, Alert } from "react-bootstrap";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const InterestsPage = () => {
  const [lastUpdate, setLastUpdate] = useState(null);
  const [daysSinceUpdate, setDaysSinceUpdate] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("authToken");

  const fetchLastUpdate = async () => {
    try {
      const response = await axios.get("https://ifund-backend.onrender.com/api/interests/last-update", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const lastUpdateDate = response.data.lastUpdate
        ? new Date(response.data.lastUpdate)
        : null;

      setLastUpdate(lastUpdateDate);

      if (lastUpdateDate) {
        const days = Math.floor((new Date() - lastUpdateDate) / (1000 * 60 * 60 * 24));
        setDaysSinceUpdate(days);
      } else {
        setDaysSinceUpdate(null); // No updates yet
      }
    } catch (error) {
      setError("Failed to fetch last update date.");
    }
  };

  const handleUpdateInterests = async () => {
    setIsUpdating(true);
    setShowModal(false);

    try {
      const response = await axios.post("https://ifund-backend.onrender.com/api/interests/update", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(response.data.message);
      fetchLastUpdate(); // Refresh last update data
    } catch (error) {
      alert("Failed to update interests.");
    } finally {
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    fetchLastUpdate();
  }, []);

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    <div>
                    <Sidebar isOpen={isSidebarOpen} />
      <div className={`main-content ${isSidebarOpen ? "" : "expanded"}`}>
        <TopNavbar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
      <h2>Manage Interests</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="my-4">
        <Card.Body>
          {lastUpdate ? (
            <>
              <h4>Last Update: {lastUpdate.toDateString()}</h4>
              <h5>Days Since Last Update: {daysSinceUpdate}</h5>
            </>
          ) : (
            <h5>No interest updates have been made yet.</h5>
          )}
          <Button
            variant="primary"
            onClick={() => setShowModal(true)}
            disabled={daysSinceUpdate !== null && daysSinceUpdate < 1 || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Interests"}
          </Button>
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Interest Update</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to update interests?{" "}
            {daysSinceUpdate !== null
              ? `This will calculate and apply interest for the past ${daysSinceUpdate} day(s).`
              : "This is the first update and will initialize interest calculations."}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateInterests}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};

export default InterestsPage;
