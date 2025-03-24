import { FaThumbsUp, FaBookmark } from 'react-icons/fa';
import '../../styles/Cards.scss';

interface HumanRightsContent {
  id: string;
  title: string;
  content: string;
  source: string;
}

interface HumanRightsCardProps {
  content: HumanRightsContent;
  isLiked: boolean;
  isBookmarked: boolean;
  onLike: () => void;
  onBookmark: () => void;
}

const HumanRightsCard = ({
  content,
  isLiked,
  isBookmarked,
  onLike,
  onBookmark
}: HumanRightsCardProps) => {
  return (
    <div className="card rights-card">
      <div className="card-content">
        <h3>{content.title}</h3>
        <p>{content.content}</p>
        <small>Source: {content.source}</small>
        
        <div className="card-actions">
          <button 
            className={`action-btn ${isLiked ? 'active' : ''}`}
            onClick={onLike}
          >
            <FaThumbsUp /> {isLiked ? 'Liked' : 'Like'}
          </button>
          <button 
            className={`action-btn ${isBookmarked ? 'active' : ''}`}
            onClick={onBookmark}
          >
            <FaBookmark /> {isBookmarked ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default HumanRightsCard;