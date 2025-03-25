import React, { useState } from 'react';
import './adminstyles/adminSidebar.scss';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  FileText, 
  BarChart, 
  Shield, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  handleNavigation: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ handleNavigation }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const sidebarItems = [
    { 
      icon: <LayoutDashboard />, 
      label: 'Dashboard', 
      view: 'dashboard' 
    },
    { 
      icon: <Users />, 
      label: 'User Management', 
      view: 'user-management' 
    },
    { 
      icon: <BarChart />, 
      label: 'Analytics', 
      view: 'analytics' 
    },
    { 
      icon: <FileText />, 
      label: 'Content Moderation', 
      view: 'content-moderation' 
    },
    { 
      icon: <Shield />, 
      label: 'Access Control', 
      view: 'access-control' 
    },
    { 
      icon: <Settings />, 
      label: 'System Settings', 
      view: 'system-settings' 
    }
  ];

  return (
    <div className={`admin-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
      </div>
      
      <div className="sidebar-content">
        <div className="sidebar-logo">
          AfriVoice
        </div>

        <nav className="sidebar-menu">
          {sidebarItems.map((item) => (
            <button 
              key={item.view}
              className="sidebar-item"
              onClick={() => handleNavigation(item.view)}
            >
              {item.icon}
              {!isCollapsed && <span className="sidebar-item-label">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;