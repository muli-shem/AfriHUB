import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts, addPost } from '../Dashboard/postSlice';
import { fetchAllContent } from '../Education/contentSlice';
import { store } from '../../app/store';
import { useNavigate } from 'react-router-dom';

import LeftSidebar from '../../components/LeftSidebar';
import RightSidebar from '../../components/RightSidebar';
import MainContent from '../../components/MainContent';
import UserNavbar from '../userNavbar'; // Import the UserNavbar component

import '../../styles/Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch<typeof store.dispatch>();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState('home');

  // State for tracking user interactions
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  const [dislikedItems, setDislikedItems] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

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
      default:
        console.warn(`Unknown view: ${view}`);
    }
  };

  // Functions to handle interactions
  const handleLike = (id: string) => {
    setLikedItems(prev => {
      const newState = { ...prev };
      newState[id] = !prev[id];
      // Remove dislike if liking
      if (newState[id]) {
        setDislikedItems(prevDislikes => {
          const newDislikes = { ...prevDislikes };
          delete newDislikes[id];
          return newDislikes;
        });
      }
      return newState;
    });
  };

  const handleDislike = (id: string) => {
    setDislikedItems(prev => {
      const newState = { ...prev };
      newState[id] = !prev[id];
      // Remove like if disliking
      if (newState[id]) {
        setLikedItems(prevLikes => {
          const newLikes = { ...prevLikes };
          delete newLikes[id];
          return newLikes;
        });
      }
      return newState;
    });
  };

  const handleBookmark = (id: string) => {
    setBookmarkedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleAddPost = () => {
    const content = prompt('Enter your post content:');
    if (content) {
      dispatch(addPost(content));
    }
  };

  return (
    <div className="dashboard-container">
      {/* Add the UserNavbar at the top */}
      <UserNavbar handleNavigation={handleNavigation} />

      <div className="dashboard-content">
        <LeftSidebar
          currentView={currentView}
          handleNavigation={handleNavigation}
          handleAddPost={handleAddPost}
        />

        <MainContent
          currentView={currentView}
          likedItems={likedItems}
          dislikedItems={dislikedItems}
          bookmarkedItems={bookmarkedItems}
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