import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../components/AdminNavbar";
import { Spinner } from "react-bootstrap";

const InactiveUsersList = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const role = localStorage.getItem("userRole");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inactiveUsers, setInactiveUsers] = useState([]);

  useEffect(() => {
    if (!token || role !== "superadmin") {
      navigate("/login");
    }

    const fetchInactiveUsersData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          "http://localhost:5000/superadmin/inactive-users",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const fetchedInactiveUsers = response.data.inactiveUsers || 0;

        setInactiveUsers(fetchedInactiveUsers);
      } catch (error) {
        console.error("Failed to fetch users data:", error);
        setError("Unable to load users data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInactiveUsersData();
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
      <div className="mt-4 container">
        <h5>Inactive Users</h5>
        {inactiveUsers.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">User ID</th>
                <th scope="col">Email</th>
                <th scope="col">Phone</th>
              </tr>
            </thead>
            <tbody>
              {inactiveUsers.map((inactiveUser, index) => (
                <tr key={inactiveUser.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{inactiveUser.full_name}</td>
                  <td>{inactiveUser.user_id}</td>
                  <td>{inactiveUser.email}</td>
                  <td>{inactiveUser.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Inactive Users available</p>
        )}
      </div>
            )}
    </div>
  );
};

export default InactiveUsersList;
