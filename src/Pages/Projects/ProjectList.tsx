import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addComment, toggleLike, toggleLove, toggleDislike, addFeedback } from './projectSlice';
import { RootState } from '../../app/store';
import { FaHeart, FaRegHeart, FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown, FaComment, FaFlag } from 'react-icons/fa';
import '../../styles/ProjecList.scss';

interface User {
  id: number;
  name: string;
}

const ProjectList: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { projects, loading, error } = useSelector((state: RootState) => state.projects);
  
  // State for user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // State for comment form
  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  
  // State for feedback form
  const [activeFeedbackId, setActiveFeedbackId] = useState<number | null>(null);
  const [feedbackTitle, setFeedbackTitle] = useState('');
  const [feedbackDescription, setFeedbackDescription] = useState('');
  const [feedbackEvidence, setFeedbackEvidence] = useState('');

  // Get user from localStorage
  useEffect(() => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        setCurrentUser(JSON.parse(userData)); 
      }
    } catch (error) {
      console.error('Error getting user data from localStorage:', error);
    }
  }, []);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Function to handle like/love/dislike - now using the frontend-only toggle functions
  const handleReaction = (projectId: number, reactionType: 'like' | 'love' | 'dislike') => {
    if (!currentUser) {
      alert('Please log in to react to projects');
      return;
    }
    
    // Use the correct toggle action based on reaction type
    switch(reactionType) {
      case 'like':
        dispatch(toggleLike({ projectId, userId: currentUser.id }));
        break;
      case 'love':
        dispatch(toggleLove({ projectId, userId: currentUser.id }));
        break;
      case 'dislike':
        dispatch(toggleDislike({ projectId, userId: currentUser.id }));
        break;
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentId || !currentUser) {
      return;
    }
    
    dispatch(addComment({
      post_id: activeCommentId,
      user_id: currentUser.id,
      content: commentText
    }));
    
    setCommentText('');
    // Keep the comment section open to show the newly added comment
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackTitle.trim() || !feedbackDescription.trim() || !activeFeedbackId || !currentUser) {
      return;
    }
    
    dispatch(addFeedback({
      title: feedbackTitle,
      description: feedbackDescription,
      evidence_url: feedbackEvidence,
      reported_by: currentUser.id,
      project_id: activeFeedbackId
    }));
    
    // Reset form and close
    setFeedbackTitle('');
    setFeedbackDescription('');
    setFeedbackEvidence('');
    setActiveFeedbackId(null);
  };

  if (loading) return <div className="loading-container">Loading...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;

  // Ensure projects is an array before mapping
  const projectList = Array.isArray(projects) ? projects : [];

  return (
    <div className="project-list-container">
      <h2>Projects</h2>
      <div className="project-feed">
        {projectList.map((project) => (
          <div key={project.id} className="project-card">
            <div className="project-content">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="project-meta">
                <span className="status">{project.status}</span>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${project.progress_percentage}%` }}
                  ></div>
                </div>
                <span className="progress-text">{project.progress_percentage}%</span>
              </div>
              {project.media_url && (
                <div className="project-image">
                  <img src={project.media_url} alt={project.title} />
                </div>
              )}
              
              {/* Interaction section */}
              <div className="project-interactions">
                <div className="interaction-buttons">
                  <button 
                    className={`interaction-btn ${project.userLiked ? 'active' : ''}`}
                    onClick={() => handleReaction(project.id!, 'like')}
                  >
                    {project.userLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
                    <span className="count">{project.likeCount || 0}</span>
                  </button>
                  
                  <button 
                    className={`interaction-btn ${project.userLoved ? 'active love' : ''}`}
                    onClick={() => handleReaction(project.id!, 'love')}
                  >
                    {project.userLoved ? <FaHeart /> : <FaRegHeart />}
                    <span className="count">{project.loveCount || 0}</span>
                  </button>
                  
                  <button 
                    className={`interaction-btn ${project.userDisliked ? 'active dislike' : ''}`}
                    onClick={() => handleReaction(project.id!, 'dislike')}
                  >
                    {project.userDisliked ? <FaThumbsDown /> : <FaRegThumbsDown />}
                    <span className="count">{project.dislikeCount || 0}</span>
                  </button>
                  
                  <button 
                    className="interaction-btn"
                    onClick={() => setActiveCommentId(activeCommentId === project.id ? null : project.id!)}
                  >
                    <FaComment />
                    <span className="count">{project.comments?.length || 0}</span>
                  </button>
                  
                  <button 
                    className="interaction-btn report"
                    onClick={() => setActiveFeedbackId(activeFeedbackId === project.id ? null : project.id!)}
                  >
                    <FaFlag />
                  </button>
                </div>
              </div>
              
              {/* Comments section */}
              {activeCommentId === project.id && (
                <div className="comments-section">
                  <h4>Comments</h4>
                  <div className="comment-list">
                    {project.comments && project.comments.length > 0 ? (
                      project.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-user">{comment.user_name}</div>
                          <div className="comment-content">{comment.content}</div>
                          <div className="comment-date">{new Date(comment.created_at || Date.now()).toLocaleDateString()}</div>
                        </div>
                      ))
                    ) : (
                      <p>No comments yet. Be the first to comment!</p>
                    )}
                  </div>
                  
                  {currentUser ? (
                    <form className="comment-form" onSubmit={handleCommentSubmit}>
                      <textarea 
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                        rows={3}
                      />
                      <button type="submit" disabled={!commentText.trim()}>
                        Comment
                      </button>
                    </form>
                  ) : (
                    <p className="login-message">Please log in to add a comment.</p>
                  )}
                </div>
              )}
              
              {/* Feedback form */}
              {activeFeedbackId === project.id && (
                <div className="feedback-section">
                  <h4>Report an Issue</h4>
                  {currentUser ? (
                    <form className="feedback-form" onSubmit={handleFeedbackSubmit}>
                      <input
                        type="text"
                        value={feedbackTitle}
                        onChange={(e) => setFeedbackTitle(e.target.value)}
                        placeholder="Issue title"
                        required
                      />
                      <textarea
                        value={feedbackDescription}
                        onChange={(e) => setFeedbackDescription(e.target.value)}
                        placeholder="Describe the issue in detail..."
                        rows={4}
                        required
                      />
                      <input
                        type="url"
                        value={feedbackEvidence}
                        onChange={(e) => setFeedbackEvidence(e.target.value)}
                        placeholder="Evidence URL (optional)"
                      />
                      <div className="feedback-buttons">
                        <button type="button" onClick={() => setActiveFeedbackId(null)}>
                          Cancel
                        </button>
                        <button 
                          type="submit" 
                          disabled={!feedbackTitle.trim() || !feedbackDescription.trim()}
                        >
                          Submit Report
                        </button>
                      </div>
                    </form>
                  ) : (
                    <p className="login-message">Please log in to report an issue.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;