import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TopNavbar from "../components/TopNavbar";
import { Spinner } from "react-bootstrap";

const DeleteRequests = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteRequests, setDeleteRequests] = useState([]);

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
    }

    const fetchDeleteRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "https://ifund-backend.onrender.com/superadmin/delete-requests",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedDeleteRequests =
          response.data.deleteRequests || 0;

          setDeleteRequests(fetchedDeleteRequests);
      } catch (error) {
        console.error("Failed to fetch incomplete registrations:", error);
        setError(
          "Unable to load  incomplete registrations data. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDeleteRequests();
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
      <div className="mt-4 container">
        <h5>Delete Requests</h5>
        {deleteRequests.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Phone</th>
                <th scope="col">Request Date</th>
              </tr>
            </thead>
            <tbody>
              {deleteRequests.map((deleteRequest, index) => (
                <tr key={deleteRequest.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{deleteRequest.full_name}</td>
                  <td>{deleteRequest.phone}</td>
                  <td>{deleteRequest.delete_request_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Delete Requests available</p>
        )}
      </div>
      )}
      </div>
    </div>
  );
};

export default DeleteRequests;
