import React, { useState, useEffect } from "react";
import { Container, Card, Button, Table, Modal, Alert } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";

const LoanRequestsPage = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");

  const [loanRequests, setLoanRequests] = useState([]);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch pending loan requests
  const fetchLoanRequests = async () => {
    try {
      const response = await axios.get("https://newly-bright-chigger.ngrok-free.app/superadmin/loan-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        setLoanRequests(response.data.loanRequests);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch loan requests.");
    }
  };

  // Approve loan request
  const handleApproveLoan = async () => {
    try {
      const response = await axios.put(
        `https://newly-bright-chigger.ngrok-free.app/loans/${selectedLoan.id}/approve`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Loan request approved!");
      setShowApproveModal(false);
      fetchLoanRequests(); // Refresh loan requests
    } catch (error) {
      alert("Error approving loan.");
      setShowApproveModal(false);
    }
  };

  // Decline loan request
  const handleDeclineLoan = async () => {
    try {
      const response = await axios.put(
        `https://newly-bright-chigger.ngrok-free.app/loans/${selectedLoan.id}/decline`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Loan request declined.");
      setShowDeclineModal(false);
      fetchLoanRequests(); // Refresh loan requests
    } catch (error) {
      alert("Error declining loan.");
      setShowDeclineModal(false);
    }
  };

  // Show modals for approving/declining
  const handleShowApproveModal = (loan) => {
    setSelectedLoan(loan);
    setShowApproveModal(true);
  };

  const handleShowDeclineModal = (loan) => {
    setSelectedLoan(loan);
    setShowDeclineModal(true);
  };

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
      return;
    }
    fetchLoanRequests();
  }, [token, role, navigate]);

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
      <h2 className="mb-4">Pending Loan Requests</h2>

      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

      <Card>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Applicant</th>
                <th>Loan Amount (KES)</th>
                <th>Duration</th>
                <th>Purpose</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loanRequests.length > 0 ? (
                loanRequests.map((loan) => (
                  <tr key={loan.id}>
                    <td>{loan.id}</td>
                    <td>{loan.user_id}</td>
                    <td>{loan.amount}</td>
                    <td>{loan.duration}</td>
                    <td>{loan.purpose}</td>
                    <td>{loan.status}</td>
                    <td>
                      {loan.status === "Pending" && (
                        <>
                          <Button
                            variant="success"
                            onClick={() => handleShowApproveModal(loan)}
                            className="me-2"
                          >
                            <FaCheckCircle /> Approve
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleShowDeclineModal(loan)}
                          >
                            <FaTimesCircle /> Decline
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No pending loan requests.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Approve Modal */}
      <Modal
        show={showApproveModal}
        onHide={() => setShowApproveModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Approve Loan Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to approve this loan request?</p>
          <p>
            <strong>Loan Amount:</strong> KES {selectedLoan?.amount}
          </p>
          <p>
            <strong>Purpose:</strong> {selectedLoan?.purpose}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowApproveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleApproveLoan}>
            Confirm Approval
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Decline Modal */}
      <Modal
        show={showDeclineModal}
        onHide={() => setShowDeclineModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Decline Loan Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to decline this loan request?</p>
          <p>
            <strong>Loan Amount:</strong> KES {selectedLoan?.amount}
          </p>
          <p>
            <strong>Purpose:</strong> {selectedLoan?.purpose}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeclineModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeclineLoan}>
            Confirm Decline
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>

  );
};

export default LoanRequestsPage;
