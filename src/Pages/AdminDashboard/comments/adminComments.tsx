// Now, let's update your AdminComments.tsx component to properly use the typed thunks:

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { fetchAllComments, deleteComment, updateComment } from './adminCommentSlice';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import './adminComments.scss';
import { AppDispatch } from '../../../app/store'; // Make sure to import this

const AdminComments = () => {
  // Use AppDispatch instead of the default dispatch type
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading, error } = useSelector((state: RootState) => state.adminComments);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');

  useEffect(() => {
    dispatch(fetchAllComments());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      dispatch(deleteComment(id));
    }
  };

  const startEditing = (comment: { id: number; content: string }) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent('');
  };

  const saveEdit = (id: number) => {
    dispatch(updateComment({ id, content: editContent }));
    setEditingId(null);
  };

  if (loading) return <div className="loading">Loading comments...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-comments">
      <h1 className="admin-comments__title">Comments Management</h1>
      <div className="comments-grid">
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <div className="comment-card__header">
              <div className="comment-card__info">
                <h3 className="comment-card__username">
                  {comment.username || 'Anonymous'}
                </h3>
                <p className="comment-card__meta">
                  Project ID: {comment.project_id}
                </p>
                <p className="comment-card__meta">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
              </div>
              <div className="comment-card__actions">
                {editingId === comment.id ? (
                  <>
                    <button
                      onClick={() => saveEdit(comment.id)}
                      className="btn btn--save"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={cancelEditing}
                      className="btn btn--cancel"
                    >
                      <FaTimes />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEditing(comment)}
                      className="btn btn--edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="btn btn--delete"
                    >
                      <FaTrash />
                    </button>
                  </>
                )}
              </div>
            </div>
            
            {editingId === comment.id ? (
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="comment-card__edit-input"
                rows={3}
              />
            ) : (
              <p className="comment-card__content">{comment.content}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminComments;