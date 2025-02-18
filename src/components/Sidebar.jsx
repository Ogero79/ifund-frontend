import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import "../styles/AdminDashboard.css";


const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
<ul>
  <li>
    <a href="/admin/dashboard" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-speedometer"></i> <span>Dashboard</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/users-list" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>All Users</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/active-users-list" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Active Users</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/inactive-users-list" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Inactive Users</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/incomplete-registrations" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Incomplete Registrations</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/delete-requests" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Delete Requests</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/loan-requests" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Loan Requests</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/interests" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Manage Interests</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/investments" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Investments</span>
    </a>
  </li>
  <li>
    <a href="/superadmin/shareholdings" style={{display: 'flex', gap: '10px'}}>
      <i className="bi bi-people"></i> <span>Shareholdings</span>
    </a>
  </li>
</ul>

    </div>
  );
};

export default Sidebar;
