import React, { useState } from 'react';
import "./adminstyles/adminDashboard.scss"
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { Link, Outlet, NavLink } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const sidebarItems = [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: <Users />, 
      label: 'User Management', 
      path: '/admin/users' 
    },
    { 
      icon: <BarChart />, 
      label: 'Analytics', 
      path: '/admin/analytics' 
    },
    { 
      icon: <FileText />, 
      label: 'Content', 
      path: '/admin/content' 
    },
    { 
      icon: <Shield />, 
      label: 'Access Control', 
      path: '/admin/access' 
    },
    { 
      icon: <Settings />, 
      label: 'Settings', 
      path: '/admin/settings' 
    }
  ];

  const internalNavItems = [
    { label: 'Overview', path: '/admin/dashboard/overview' },
    { label: 'Reports', path: '/admin/dashboard/reports' },
    { label: 'Performance', path: '/admin/dashboard/performance' },
    { label: 'Insights', path: '/admin/dashboard/insights' }
  ];

  return (
    <div className="admin-dashboard">
      {/* Full-width Navbar */}
      <div className="full-width-navbar">
        <div className="navbar-left">
          <button 
            className="sidebar-toggle"
            onClick={toggleSidebar}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
          
          <div className="logo">AfriVoice Admin</div>
        </div>

        <div className="navbar-center">
          <div className="search-container">
            <Search className="search-icon" />
            <input 
              type="text" 
              placeholder="Search dashboard" 
            />
          </div>
        </div>

        <div className="navbar-right">
          <div className="notification-icon">
            <Bell />
            <div className="badge">3</div>
          </div>

          <div className="mobile-nav-toggle" onClick={toggleNav}>
            {isNavOpen ? <X /> : <Menu />}
          </div>

          <div className="user-profile"></div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Sidebar */}
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-menu">
            {sidebarItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className="menu-item"
              >
                {item.icon}
                {!isSidebarCollapsed && (
                  <span className="menu-item-label">{item.label}</span>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Internal Navigation */}
          <div className="internal-nav">
            {internalNavItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  isActive ? 'nav-item active' : 'nav-item'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          {/* Content Area */}
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;