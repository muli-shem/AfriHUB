import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, addComment, toggleLike, toggleLove, toggleDislike, addFeedback } from './projectSlice';
import { RootState } from '../../app/store';
import { FaHeart, FaRegHeart, FaThumbsUp, FaRegThumbsUp, FaThumbsDown, FaRegThumbsDown, FaComment, FaFlag, FaImage } from 'react-icons/fa';
import '../../styles/ProjecList.scss';

interface User {
  id: number;
  username: string;
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
  const [feedbackImage, setFeedbackImage] = useState<File | null>(null);
  
  // Ref for file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (userId && username) {
      setCurrentUser({
        id: Number(userId),
        username: username
      });
    }
  }, []);

  // Fetch projects and set up auto-refresh
  useEffect(() => {
    const fetchAndRefresh = () => {
      dispatch(fetchProjects());
    };

    // Initial fetch
    fetchAndRefresh();

    // Set up periodic refresh every 60 seconds
    const intervalId = setInterval(fetchAndRefresh, 600000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Function to handle image selection for feedback
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFeedbackImage(e.target.files[0]);
    }
  };

  // Function to trigger file input
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Function to handle like/love/dislike
  const handleReaction = (projectId: number, reactionType: 'like' | 'love' | 'dislike') => {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Please log in to react to projects');
      return;
    }
     
    switch(reactionType) {
      case 'like':
        dispatch(toggleLike(projectId));
        break;
      case 'love':
        dispatch(toggleLove(projectId));
        break;
      case 'dislike':
        dispatch(toggleDislike(projectId));
        break;
    }
  };

  // Function to handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Please log in to add a comment');
      return;
    }
    
    if (!commentText.trim() || !activeCommentId) {
      return;
    }
    
    dispatch(addComment({
      project_id: activeCommentId,
      content: commentText
    }));
    
    setCommentText('');
    setActiveCommentId(null);
  };

  // Function to handle feedback submission
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
      alert('Please log in to report an issue');
      return;
    }
    
    if (!feedbackTitle.trim() || !feedbackDescription.trim() || !activeFeedbackId) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      await dispatch(addFeedback({
        project_id: activeFeedbackId,
        title: feedbackTitle,
        description: feedbackDescription,
        evidence_url: feedbackEvidence || undefined,
        evidence_image: feedbackImage
      })).unwrap();
      
      // Reset form
      setFeedbackTitle('');
      setFeedbackDescription('');
      setFeedbackEvidence('');
      setFeedbackImage(null);
      setActiveFeedbackId(null);
    } catch (error) {
      console.error('Failed to submit feedback', error);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  const renderFeedbacks = (projectId: number) => {
    const project = projects.find(p => p.id === projectId);
    const feedbacks = project?.feedbacks || [];
  
    return (
      <div className="feedbacks-section">
        <h4>Reported Issues</h4>
        {feedbacks.length > 0 ? (
          <div className="feedback-list">
            {feedbacks.map((feedback) => (
              <div key={feedback.id} className="feedback">
                <div className="feedback-title">{feedback.title}</div>
                <div className="feedback-description">{feedback.description}</div>
                
                {/* Only show the image if evidence_image exists */}
                {feedback.evidence_url && (
                  <div className="project-image">
                    <img 
                      src={feedback.evidence_url} 
                      alt={`Evidence for ${feedback.title}`}
                      style={{ maxWidth: '100%', display: 'block' }}
                      onError={(e) => {
                        console.error('Image failed to load:', feedback.evidence_url);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No issues reported for this project.</p>
        )}
      </div>
    );
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
                          <div className="comment-user">{comment.username || 'Anonymous'}</div>
                          <div className="comment-content">{comment.content}</div>
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

                  {/* Render Feedbacks in Comments Section */}
                  {renderFeedbacks(project.id!)}
                </div>
              )}
              
              {/* Feedback section */}
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
                      <div className="image-upload-container">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageSelect}
                          accept="image/*"
                          style={{ display: 'none' }}
                        />
                        <button 
                          type="button" 
                          onClick={triggerFileInput} 
                          className="image-upload-btn"
                        >
                          <FaImage /> {feedbackImage ? 'Image Selected' : 'Upload Image'}
                        </button>
                      </div>
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