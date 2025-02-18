import React from "react";
import "../styles/AdminDashboard.css";

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`sidebar ${isOpen ? "" : "closed"}`}>
      <ul>
        <li><a href="/">🏠 <span>Dashboard</span></a></li>
        <li><a href="/users">👥 <span>Users</span></a></li>
        <li><a href="/settings">⚙️ <span>Settings</span></a></li>
      </ul>
    </div>
  );
};

export default Sidebar;
