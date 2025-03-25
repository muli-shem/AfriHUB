import React, { useState } from "react";
import "./adminstyles/adminNabar.scss"
import { 
  Users, 
  BarChart, 
  Clipboard, 
  Lock,
  User,
  Bell,
  Settings,
  LogOut 
} from "lucide-react";

interface AdminNavbarProps {
  handleNavigation: (view: string) => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ handleNavigation }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="admin-navbar">
      <div className="navbar-container">
        {/* Logo */}
        <div className="logo">
          AfriVoice Admin
        </div>

        {/* Navigation Links */}
        <ul className="nav-links">
          <li>
            <button onClick={() => handleNavigation("dashboard")}>
              <BarChart className="mr-2" /> Dashboard
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("user-management")}>
              <Users className="mr-2" /> User Management
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("content-moderation")}>
              <Clipboard className="mr-2" /> Content Moderation
            </button>
          </li>
          <li>
            <button onClick={() => handleNavigation("access-control")}>
              <Lock className="mr-2" /> Access Control
            </button>
          </li>
        </ul>

        {/* User Actions */}
        <div className="user-actions">
          {/* Notifications */}
          <div className="notification-icon">
            <Bell />
            <span className="notification-badge">5</span> {/* Admin notification count */}
          </div>

          {/* Profile Dropdown */}
          <div className="profile-dropdown" onClick={toggleDropdown}>
            <User className="profile-icon" />
            {isDropdownOpen && (
              <div className="dropdown-menu">
                <div 
                  className="dropdown-item" 
                  onClick={() => handleNavigation("profile")}
                >
                  <User className="mr-2" /> Admin Profile
                </div>
                <div 
                  className="dropdown-item"
                  onClick={() => handleNavigation("settings")}
                >
                  <Settings className="mr-2" /> System Settings
                </div>
                <div className="dropdown-item">
                  <LogOut className="mr-2" /> Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;