import React, { useState } from 'react';
import "./adminstyles/adminDashboard.scss"
import { 
  LayoutDashboard, 
  Users, 
  Settings as SettingsIcon, 
  Shield, 
  ChevronLeft, 
  ChevronRight,
  Bell,
  Search,
  Menu,
  X,
  MessageSquare,
  FileText,
  GraduationCap
} from 'lucide-react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';

const AdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  // Check if the current route is the main dashboard page
  const isMainDashboard = location.pathname === '/admin' || location.pathname === '/admin/dashboard';

  const sidebarItems = [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      path: '/admin/dashboard' 
    },
    { 
      icon: <Users />, 
      label: 'Users', 
      path: '/admin/users' 
    },
    { 
      icon: <FileText />, 
      label: 'Projects', 
      path: '/admin/projects' 
    },
    { 
      icon: <MessageSquare />, 
      label: 'Comments', 
      path: '/admin/comments' 
    },
    { 
      icon: <Shield />, 
      label: 'Feedback', 
      path: '/admin/feedbacks' 
    },
    { 
      icon: <GraduationCap />, 
      label: 'Education', 
      path: '/admin/education' 
    },
    { 
      icon: <SettingsIcon />, 
      label: 'Settings', 
      path: '/admin/settings' 
    }
  ];

  // Only show internal nav items for main dashboard section
  const internalNavItems = isMainDashboard ? [
    { label: 'Overview', path: '/admin/dashboard' },
    { label: 'Reports', path: '/admin/dashboard/reports' },
    { label: 'Performance', path: '/admin/dashboard/performance' },
    { label: 'Insights', path: '/admin/dashboard/insights' }
  ] : [];

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
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${isNavOpen ? 'mobile-open' : ''}`}>
          <div className="sidebar-menu">
            {sidebarItems.map((item) => (
              <NavLink 
                key={item.path} 
                to={item.path} 
                className={({ isActive }) => 
                  isActive ? 'menu-item active' : 'menu-item'
                }
                onClick={() => isNavOpen && toggleNav()}
              >
                {item.icon}
                {!isSidebarCollapsed && (
                  <span className="menu-item-label">{item.label}</span>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          {/* Internal Navigation - only show for appropriate sections */}
          {internalNavItems.length > 0 && (
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
          )}

          {/* Content Area - Outlet renders the child routes */}
          <div className="content-area">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;