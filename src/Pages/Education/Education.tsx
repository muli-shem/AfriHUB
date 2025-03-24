import { useState } from 'react';
import { FaThumbsUp, FaThumbsDown, FaShareAlt, FaBookmark } from 'react-icons/fa';
import '../../styles/Cards.scss';

interface EducationContent {
  id: string;
  title: string;
  content: string;
  content_type: string;
  created_by: string;
  image_url?: string;
}

interface EducationCardProps {
  content: EducationContent;
  initialLikeCount?: number;
  isBookmarked: boolean;
  onBookmark: () => void;
}

const EducationCard = ({
  content,
  initialLikeCount = 0,
  isBookmarked,
  onBookmark
}: EducationCardProps) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      // If it was previously disliked, remove the dislike
      if (isDisliked) {
        setIsDisliked(false);
      }
    } else {
      // Unlike if already liked
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
    }
  };

  const handleDislike = () => {
    if (!isDisliked) {
      // If not already disliked, decrease the like count
      setLikeCount(prev => prev - 1);
      setIsDisliked(true);
      // If it was previously liked, remove the like
      if (isLiked) {
        setIsLiked(false);
      }
    } else {
      // Remove dislike if already disliked
      setLikeCount(prev => prev + 1);
      setIsDisliked(false);
    }
  };

  return (
    <div className="card education-card">
      <div className="card-content">
        <div className="card-header">
          <h3>{content.title}</h3>
          <small>Type: {content.content_type} | Created by: {content.created_by}</small>
        </div>
        
        <p className="card-text">{content.content}</p>
        
        {content.image_url && (
          <div className="card-image twitter-style">
            <img src={content.image_url} alt={content.title} />
          </div>
        )}
        
        <div className="card-actions">
          <div className="action-wrapper">
            <button 
              className={`action-btn ${isLiked ? 'active' : ''}`}
              onClick={handleLike}
            >
              <FaThumbsUp /> 
              <span className="count">{likeCount}</span>
            </button>
          </div>
          
          <div className="action-wrapper">
            <button 
              className={`action-btn ${isDisliked ? 'active' : ''}`}
              onClick={handleDislike}
            >
              <FaThumbsDown />
            </button>
          </div>
          
          <div className="action-wrapper">
            <button className="action-btn">
              <FaShareAlt /> Share
            </button>
          </div>
          
          <div className="action-wrapper">
            <button 
              className={`action-btn ${isBookmarked ? 'active' : ''}`}
              onClick={onBookmark}
            >
              <FaBookmark />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationCard;