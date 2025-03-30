import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { fetchAllFeedback, deleteFeedback, updateFeedbackStatus } from './adminFeedbackSlice';
import { FaTrash, FaEye } from 'react-icons/fa';
import './feedback.scss';

const statusOptions = ['pending', 'reviewed', 'resolved'];

const AdminFeedback = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { feedbacks, loading, error } = useSelector((state: RootState) => state.adminFeedback);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchAllFeedback());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this feedback report?')) {
      dispatch(deleteFeedback(id));
    }
  };

  const handleStatusChange = (id: number, status: string) => {
    dispatch(updateFeedbackStatus({ id, status }));
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) return <div className="loading">Loading feedback reports...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-feedback">
      <h1 className="admin-feedback__title">Feedback Reports Management</h1>
      <div className="feedback-grid">
        {feedbacks.map((feedback) => (
          <div key={feedback.id} className={`feedback-card ${feedback.status}`}>
            <div className="feedback-card__header">
              <h3 className="feedback-card__title" onClick={() => toggleExpand(feedback.id)}>
                {feedback.title}
                <span className={`status-badge ${feedback.status}`}>
                  {feedback.status}
                </span>
              </h3>
              <div className="feedback-card__actions">
                <select
                  value={feedback.status}
                  onChange={(e) => handleStatusChange(feedback.id, e.target.value)}
                  className="status-select"
                >
                  {statusOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(feedback.id)}
                  className="btn btn--delete"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="feedback-card__meta">
              <span>Reported by: {feedback.reporter_name || 'Anonymous'}</span>
              <span>Project: {feedback.project_title || `ID: ${feedback.project_id}`}</span>
              <span>Date: {new Date(feedback.created_at).toLocaleString()}</span>
            </div>

            {(expandedId === feedback.id) && (
              <div className="feedback-card__details">
                <p className="feedback-card__description">
                  {feedback.description}
                </p>
                
                {feedback.evidence_url && (
                  <div className="feedback-card__evidence">
                    <h4>Evidence:</h4>
                    <a 
                      href={feedback.evidence_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="evidence-link"
                    >
                      <FaEye /> View Evidence
                    </a>
                    {feedback.evidence_url.match(/\.(jpeg|jpg|gif|png)$/) && (
                      <img 
                        src={feedback.evidence_url} 
                        alt="Evidence" 
                        className="evidence-image"
                      />
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminFeedback;