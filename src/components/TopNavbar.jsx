import React from "react";
import "../styles/AdminDashboard.css";
import { useNavigate } from 'react-router-dom';

const TopNavbar = ({ isSidebarOpen, toggleSidebar }) => {
  const navigate = useNavigate();
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };
  return (
    <nav className={`top-navbar ${isSidebarOpen ? "" : "full-width"}`}>
      <button className="menu-btn" onClick={toggleSidebar}>
      <i className="icon bi bi-list" style={{fontSize:'30px'}}></i></button>
      <div className="nav-icons">
        <div className="dropdown">
        <i className="icon bi bi-bell"></i>
          <div className="dropdown-content">No notifications</div>
        </div>
        <div className="dropdown">
        <i className="icon bi bi-chat-left"></i>
          <div className="dropdown-content">No messages</div>
        </div>
        <button onClick={toggleFullscreen} className="fullscreen-btn">
      <i className="icon bi bi-fullscreen"></i>
    </button>
        <div className="dropdown">
    <img src="/avatar.jpg" className="avatar img-fluid rounded-circle me-1" alt="Charles Hall" width="40" height="40" />
  <div className=" dropdown-content">
    <a className="dropdown-item" href="pages-profile.html">
    <i className="icon bi bi-person"></i>Profile
    </a>
    <a className="dropdown-item" href="#">
    <i className="icon bi bi-gear"></i> Settings & Privacy
    </a>
    <hr></hr>
    <a className="dropdown-item text-danger" onClick={() => {
            localStorage.clear();
            navigate('/login');
          }}>
    <i className="icon bi bi-box-arrow-right"></i> Log out
    </a>
  </div>
</div>

      </div>
    </nav>
  );
};

export default TopNavbar;
