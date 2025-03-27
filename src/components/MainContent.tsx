import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import EducationCard from '../Pages/Education/Education';
import HumanRightsCard from '../Pages/Education/HumanRights';
import { humanRightsContent } from './RightSidebar';
import '../styles/MainContent.scss';
import ProjectList from '../Pages/Projects/ProjectList';
import  UserProfile from '../Pages/Profile/userProfile'

interface MainContentProps {
  currentView: string;
  interactions: {
    [contentType: string]: {
      [contentId: string]: {
        liked: boolean;
        disliked: boolean;
        bookmarked: boolean;
      }
    }
  };
  handleLike: (contentId: string, contentType: string) => void;
  handleDislike: (contentId: string, contentType: string) => void;
  handleBookmark: (contentId: string, contentType: string) => void;
  handleNavigation: (view: string) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  currentView,
  interactions,
  handleLike,
  handleDislike,
  handleBookmark,
}) => {
  const { posts, status, error } = useSelector((state: RootState) => state.posts);
  const educationContent = useSelector((state: RootState) => state.education.items);

  // Function to get interaction state for a specific content item
  const getInteractionState = (contentId: string, contentType: string) => {
    const contentInteractions = interactions[contentType] || {};
    const itemInteraction = contentInteractions[contentId] || {
      liked: false,
      disliked: false,
      bookmarked: false
    };
    return itemInteraction;
  };

  // Function to render the correct content based on currentView
  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <section className="posts">
            {status === 'loading' && <p>Loading posts...</p>}
            {status === 'failed' && <p>Error: {error}</p>}
            {status === 'succeeded' && (
              <ul>
                {Array.isArray(posts) && posts.map((post) => (
                  <li key={post.id}>
                    <p>{post.content}</p>
                    <small>By {post.author} on {new Date(post.timestamp).toLocaleString()}</small>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      
      case 'education':
        return (
          <section className="education-content">
            <h2>Civic Education</h2>
            {educationContent.length === 0 ? (
              <p>Loading educational content...</p>
            ) : (
              <div className="education-cards">
                {educationContent.map((content) => {
                  const interactionState = getInteractionState(
                    content.id.toString(), 
                    'education'
                  );
                  
                  return (
                    <div className="card" key={content.id}>
                      <h3>{content.title}</h3>
                      <p>{content.content}</p>
                      <EducationCard 
                        content={{
                          id: content.id.toString(),
                          title: content.title,
                          content: content.content,
                          content_type: content.content_type,
                          created_by: content.created_by.toString(),
                          image_url: content.image_url || undefined
                        }}
                        {...{
                          isLiked: interactionState.liked,
                          isDisliked: interactionState.disliked,
                          isBookmarked: interactionState.bookmarked,
                          onLike: () => handleLike(content.id.toString(), 'education'),
                          onDislike: () => handleDislike(content.id.toString(), 'education'),
                          onBookmark: () => handleBookmark(content.id.toString(), 'education')
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      
      case 'humanrights':
        return (
          <section className="human-rights-content">
            <h2>Human Rights Information</h2>
            <div className="rights-cards">
              {humanRightsContent.map((content) => {
                const interactionState = getInteractionState(
                  content.id.toString(), 
                  'humanrights'
                );
                
                return (
                  <div className="card" key={content.id}>
                    <h3>{content.title}</h3>
                    <p>{content.content}</p>
                    <HumanRightsCard 
                      content={content}
                      {...{
                        isLiked: interactionState.liked,
                        isBookmarked: interactionState.bookmarked,
                        onLike: () => handleLike(content.id.toString(), 'humanrights'),
                        onBookmark: () => handleBookmark(content.id.toString(), 'humanrights')
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </section>
        );
      
      case 'explore':
        return (
          <section className="explore-content">
            <h2>Explore Projects</h2>
            <ProjectList />
          </section>
        );
        case 'profile':
          return (
            <section className="explore-content">
              <h2>Profile</h2>
              < UserProfile/>
            </section>
          );
      
      default:
        return <div className="content-placeholder">Select an option from the sidebar</div>;
    }
  };

  return (
    <main className="main-content">
      <header>
        <h1>AfriVoice Hub</h1>
      </header>
      <div className="scrollable-content">
        {renderContent()}
      </div>
    </main>
  );
};

export default MainContent;