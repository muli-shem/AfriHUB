import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts,createPost } from '../posts/postsSlice';
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
  const [currentView, setCurrentView] = useState('home');

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
    posts: {}
  });

  useEffect(() => {
    dispatch(fetchPosts());
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

    // Load educational content when switching to that view
    if (view === 'education') {
      dispatch(fetchAllContent());
    }

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

  // Function to add a new post
  const handleAddPost = () => {
    const content = prompt('Enter your post content:');
    if (content) {
      dispatch(createPost({ content }));
    }
  };

  return (
    <div className="dashboard-container">
      <UserNavbar handleNavigation={handleNavigation} />
      
      <div className="dashboard-content">
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