import React, { useState } from "react";
import { FaUserCircle, FaBell, FaCog, FaSignOutAlt, FaBars } from "react-icons/fa";
import "../styles/userNavbar.scss";

interface UserNavbarProps {
  handleNavigation: (view: string) => void;
}

const UserNavbar: React.FC<UserNavbarProps> = ({ handleNavigation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavigation = (view: string) => {
    handleNavigation(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-container">
        {/* Mobile Menu Toggle */}
        <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          <FaBars />
        </div>

        {/* Logo */}
        <div className="logo">
          AfriVoice Hub
        </div>

        {/* Navigation Links - Desktop and Mobile */}
        <ul className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <li>
            <a onClick={() => handleMobileNavigation("dashboard")}>Dashboard</a>
          </li>
          <li>
            <a onClick={() => handleMobileNavigation("education")}>Education</a>
          </li>
          <li>
            <a onClick={() => handleMobileNavigation("content")}>Create Civic Content</a>
          </li>
        </ul>

        {/* User Actions */}
        <div className="user-actions">
          {/* Notifications */}
          <div className="notification-icon">
            <FaBell />
            <span className="notification-badge">3</span>
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" onClick={toggleDropdown}>
            <FaUserCircle className="profile-icon" />
            
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <a className="dropdown-item" onClick={() => handleNavigation("profile")}>
                  <FaUserCircle /> Profile
                </a>
                <a className="dropdown-item" onClick={() => handleNavigation("settings")}>
                  <FaCog /> Settings
                </a>
                <a className="dropdown-item" onClick={() => handleNavigation("logout")}>
                  <FaSignOutAlt /> Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default UserNavbar;