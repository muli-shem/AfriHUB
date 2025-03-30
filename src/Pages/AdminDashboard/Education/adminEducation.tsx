import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../app/store';
import { 
  fetchAllEducationContent, 
  deleteEducationContent,
  updateEducationContent,
  createEducationContent
} from './adminEducationSlice';
import { FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import './adminEducation.scss';

// Import or define the EducationContent interface
interface EducationContent {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  content_type: string;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at: string;
}

const contentTypeOptions = ['article', 'video', 'infographic', 'guide', 'tutorial'];

const AdminEducationContent = () => {
  // Use AppDispatch type for proper typing of dispatch
  const dispatch = useDispatch<AppDispatch>();
  const { contents, loading, error } = useSelector((state: RootState) => state.adminEducation);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<EducationContent>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newContent, setNewContent] = useState<Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    content: '',
    content_type: 'article',
    created_by: Number(localStorage.getItem('userId')) || 0,
    image_url: ''
  });

  useEffect(() => {
    dispatch(fetchAllEducationContent());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      dispatch(deleteEducationContent(id));
    }
  };

  const startEditing = (content: EducationContent) => {
    setEditingId(content.id);
    setEditData({
      title: content.title,
      content: content.content,
      content_type: content.content_type,
      image_url: content.image_url
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = (id: number) => {
    dispatch(updateEducationContent({ id, contentData: editData }));
    setEditingId(null);
  };

  const handleCreate = () => {
    dispatch(createEducationContent(newContent));
    setIsCreating(false);
    setNewContent({
      title: '',
      content: '',
      content_type: 'article',
      created_by: Number(localStorage.getItem('userId')) || 0,
      image_url: ''
    });
  };

  if (loading) return <div className="loading">Loading education content...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-education">
      <div className="admin-education__header">
        <h1 className="admin-education__title">Education Content Management</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn btn--create"
        >
          <FaPlus /> Add New Content
        </button>
      </div>

      {isCreating && (
        <div className="content-form">
          <h3>Create New Content</h3>
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              value={newContent.title}
              onChange={(e) => setNewContent({...newContent, title: e.target.value})}
              placeholder="Enter title"
            />
          </div>
          <div className="form-group">
            <label>Content Type</label>
            <select
              value={newContent.content_type}
              onChange={(e) => setNewContent({...newContent, content_type: e.target.value})}
            >
              {contentTypeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Image URL</label>
            <input
              type="text"
              value={newContent.image_url || ''}
              onChange={(e) => setNewContent({...newContent, image_url: e.target.value})}
              placeholder="Enter image URL"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <textarea
              value={newContent.content}
              onChange={(e) => setNewContent({...newContent, content: e.target.value})}
              placeholder="Enter content"
              rows={5}
            />
          </div>
          <div className="form-actions">
            <button 
              onClick={() => setIsCreating(false)}
              className="btn btn--cancel"
            >
              Cancel
            </button>
            <button 
              onClick={handleCreate}
              className="btn btn--save"
              disabled={!newContent.title || !newContent.content}
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="content-grid">
        {contents.map((content) => (
          <div key={content.id} className="content-card">
            {editingId === content.id ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => setEditData({...editData, title: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Content Type</label>
                  <select
                    value={editData.content_type || ''}
                    onChange={(e) => setEditData({...editData, content_type: e.target.value})}
                  >
                    {contentTypeOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    type="text"
                    value={editData.image_url || ''}
                    onChange={(e) => setEditData({...editData, image_url: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Content</label>
                  <textarea
                    value={editData.content || ''}
                    onChange={(e) => setEditData({...editData, content: e.target.value})}
                    rows={5}
                  />
                </div>
                <div className="form-actions">
                  <button 
                    onClick={cancelEditing}
                    className="btn btn--cancel"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => saveEdit(content.id)}
                    className="btn btn--save"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="content-card__header">
                  <div>
                    <h3 className="content-card__title">{content.title}</h3>
                    <span className={`content-type ${content.content_type}`}>
                      {content.content_type}
                    </span>
                  </div>
                  <div className="content-card__actions">
                    <button
                      onClick={() => startEditing(content)}
                      className="btn btn--edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(content.id)}
                      className="btn btn--delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {content.image_url && (
                  <div className="content-card__image">
                    <img src={content.image_url} alt={content.title} />
                  </div>
                )}

                <div className="content-card__content">
                  {content.content.length > 150 
                    ? `${content.content.substring(0, 150)}...` 
                    : content.content}
                </div>

                <div className="content-card__meta">
                  <span>Created by: {content.creator_name || 'Admin'}</span>
                  <span>
                    {new Date(content.created_at).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEducationContent;