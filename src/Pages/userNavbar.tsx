import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt } from "react-icons/fa";
import "../styles/UserNavbar.scss"; // Ensure the path is correct

interface UserNavbarProps {
  handleNavigation: (view: string) => void; // Add this prop
}

const UserNavbar: React.FC<UserNavbarProps> = ({ handleNavigation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="logo">
          AfriVoice Hub
        </Link>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <button onClick={() => handleNavigation("dashboard")}>Dashboard</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("education")}>Education</button>
          </li>
          <li>
            <button onClick={() => handleNavigation("content")}>Create Civic Content</button>
          </li>
        </ul>

        {/* User Actions */}
        <div className="user-actions">
          {/* Notifications */}
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span> {/* Notification count */}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" onClick={toggleDropdown}>
            <FaUserCircle className="profile-icon" />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <FaUserCircle /> Profile
                </Link>
                <Link to="/settings" className="dropdown-item">
                  <FaCog /> Settings
                </Link>
                <div className="dropdown-item">
                  <FaSignOutAlt /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;