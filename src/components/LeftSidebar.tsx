import { FaHome, FaSearch, FaBell, FaEnvelope, FaUser, FaPlusCircle, FaBookReader, FaInfoCircle } from 'react-icons/fa';
import '../styles/LeftSidebar.scss';

interface LeftSidebarProps {
  currentView: string;
  handleNavigation: (view: string) => void;
  handleAddPost: () => void;
}

const LeftSidebar = ({ currentView, handleNavigation, handleAddPost }: LeftSidebarProps) => {
  return (
    <nav className="sidebar left-sidebar">
      <div className="sidebar-content">
        <h2 className="app-name">AfriVoice</h2>
        <ul>
          <li 
            className={currentView === 'home' ? 'active' : ''} 
            onClick={() => handleNavigation('home')}
          >
            <FaHome /> <span>Home</span>
          </li>
          <li 
            className={currentView === 'explore' ? 'active' : ''} 
            onClick={() => handleNavigation('explore')}
          >
            <FaSearch /> <span>Explore</span>
          </li>
          <li 
            className={currentView === 'education' ? 'active' : ''} 
            onClick={() => handleNavigation('education')}
          >
            <FaBookReader /> <span>Civic Education</span>
          </li>
          <li 
            className={currentView === 'notifications' ? 'active' : ''} 
            onClick={() => handleNavigation('notifications')}
          >
            <FaBell /> <span>Notifications</span>
          </li>
          <li 
            className={currentView === 'messages' ? 'active' : ''} 
            onClick={() => handleNavigation('messages')}
          >
            <FaEnvelope /> <span>Messages</span>
          </li>
          <li 
            className={currentView === 'profile' ? 'active' : ''} 
            onClick={() => handleNavigation('profile')}
          >
            <FaUser /> <span>Profile</span>
          </li>
          <li 
            className={currentView === 'humanrights' ? 'active' : ''} 
            onClick={() => handleNavigation('humanrights')}
          >
            <FaInfoCircle /> <span>Human Rights</span>
          </li>
          <li onClick={handleAddPost} className="post-btn">
            <FaPlusCircle /> <span>Post</span>
          </li>
          
        </ul>
      </div>
    </nav>
  );
};

export default LeftSidebar;