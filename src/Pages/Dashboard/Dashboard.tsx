import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchAllContent } from '../Education/contentSlice';
import { store } from '../../app/store';
import { useNavigate } from 'react-router-dom';

import LeftSidebar from '../../components/LeftSidebar';
import RightSidebar from '../../components/RightSidebar';
import MainContent from '../../components/MainContent';
import UserNavbar from '../userNavbar';
import '../../styles/Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();

  // State to track user interactions across different content types
  const [interactions, setInteractions] = useState<{
    [contentType: string]: {
      [contentId: string]: {
        liked: boolean;
        disliked: boolean;
        bookmarked: boolean;
      }
    }
  }>({
    education: {},
    humanrights: {},
  });

  // Default view is now 'explore'
  const [currentView, setCurrentView] = useState('explore');

  useEffect(() => {
    // Load content for explore view by default
    dispatch(fetchAllContent());
  }, [dispatch]);

  // Generic handler for likes
  const handleLike = (contentId: string, contentType: string) => {
    setInteractions(prev => {
      const currentContentInteractions = prev[contentType] || {};
      const currentItemInteraction = currentContentInteractions[contentId] || { 
        liked: false, 
        disliked: false, 
        bookmarked: false 
      };

      return {
        ...prev,
        [contentType]: {
          ...currentContentInteractions,
          [contentId]: {
            ...currentItemInteraction,
            liked: !currentItemInteraction.liked,
            disliked: false // Reset dislike when liking
          }
        }
      };
    });
  };

  // Generic handler for dislikes
  const handleDislike = (contentId: string, contentType: string) => {
    setInteractions(prev => {
      const currentContentInteractions = prev[contentType] || {};
      const currentItemInteraction = currentContentInteractions[contentId] || { 
        liked: false, 
        disliked: false, 
        bookmarked: false 
      };

      return {
        ...prev,
        [contentType]: {
          ...currentContentInteractions,
          [contentId]: {
            ...currentItemInteraction,
            disliked: !currentItemInteraction.disliked,
            liked: false // Reset like when disliking
          }
        }
      };
    });
  };

  // Generic handler for bookmarks
  const handleBookmark = (contentId: string, contentType: string) => {
    setInteractions(prev => {
      const currentContentInteractions = prev[contentType] || {};
      const currentItemInteraction = currentContentInteractions[contentId] || { 
        liked: false, 
        disliked: false, 
        bookmarked: false 
      };

      return {
        ...prev,
        [contentType]: {
          ...currentContentInteractions,
          [contentId]: {
            ...currentItemInteraction,
            bookmarked: !currentItemInteraction.bookmarked
          }
        }
      };
    });
  };

  // Function to handle navigation
  const handleNavigation = (view: string) => {
    setCurrentView(view);

    // Handle navigation for specific views
    switch (view) {
      case 'content':
        navigate('/content'); // Navigate to the "Create Civic Content" page
        break;
      case 'createproject':
        navigate('/createproject'); // Navigate to the "Create a Project" page
        break;
      default:
        console.warn(`Unknown view: ${view}`);
    }
  };

  // Placeholder empty function to satisfy LeftSidebar prop requirement
  const handleAddPost = () => {};

  return (
    <div className="dashboard-containerpro">
      <UserNavbar handleNavigation={handleNavigation} />
      
      <div className="dashboard-contentpro">
        <LeftSidebar
          currentView={currentView}
          handleNavigation={handleNavigation}
          handleAddPost={handleAddPost}
        />
        
        <MainContent
          currentView={currentView}
          interactions={interactions}
          handleLike={handleLike}
          handleDislike={handleDislike}
          handleBookmark={handleBookmark}
          handleNavigation={handleNavigation}
        />
        
        <RightSidebar
          handleNavigation={handleNavigation}
        />
      </div>
    </div>
  );
};

export default Dashboard;