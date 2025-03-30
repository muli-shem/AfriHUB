import  { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { 
  fetchAllProjects, 
  createProject,
  updateProject,
  deleteProject,
  Project  // Import the Project type
} from './adminProjectSlice';
import { FaTrash, FaEdit, FaPlus, FaCalendarAlt, FaUserTie, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import { FiPercent } from 'react-icons/fi';
import './adminproject.scss';

const statusOptions = ['ongoing', 'completed', 'stalled'];

const AdminProjects = () => {
  const dispatch = useDispatch<AppDispatch>();  // Use AppDispatch type
  const { projects, loading, error } = useSelector((state: RootState) => state.adminProjects);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Project>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [newProject, setNewProject] = useState<Omit<Project, 'id' | 'created_at' | 'updated_at'>>({
    title: '',
    description: '',
    responsible_officer: '',
    status: 'ongoing',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    county: '',
    sub_county: '',
    ward: '',
    budget: 0,
    progress_percentage: 0,
    media_url: ''
  });

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      dispatch(deleteProject(id));
    }
  };

  const startEditing = (project: Project) => {
    setEditingId(project.id);
    setEditData({
      title: project.title,
      description: project.description,
      responsible_officer: project.responsible_officer,
      status: project.status,
      start_date: project.start_date,
      end_date: project.end_date,
      county: project.county,
      sub_county: project.sub_county,
      ward: project.ward,
      budget: project.budget,
      progress_percentage: project.progress_percentage,
      media_url: project.media_url
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = (id: number) => {
    dispatch(updateProject({ id, projectData: editData }));
    setEditingId(null);
  };

  const handleCreate = () => {
    dispatch(createProject(newProject));
    setIsCreating(false);
    setNewProject({
      title: '',
      description: '',
      responsible_officer: '',
      status: 'ongoing',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      county: '',
      sub_county: '',
      ward: '',
      budget: 0,
      progress_percentage: 0,
      media_url: ''
    });
  };

  if (loading) return <div className="loading">Loading projects...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="admin-projects">
      <div className="admin-projects__header">
        <h1 className="admin-projects__title">Projects Management</h1>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn btn--create"
        >
          <FaPlus /> Add New Project
        </button>
      </div>

      {isCreating && (
        <div className="project-form">
          <h3>Create New Project</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={newProject.title}
                onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                placeholder="Project title"
              />
            </div>
            <div className="form-group">
              <label>Responsible Officer</label>
              <input
                type="text"
                value={newProject.responsible_officer}
                onChange={(e) => setNewProject({...newProject, responsible_officer: e.target.value})}
                placeholder="Officer name"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date</label>
              <input
                type="date"
                value={newProject.start_date}
                onChange={(e) => setNewProject({...newProject, start_date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>End Date</label>
              <input
                type="date"
                value={newProject.end_date}
                onChange={(e) => setNewProject({...newProject, end_date: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                value={newProject.status}
                onChange={(e) => setNewProject({...newProject, status: e.target.value})}
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>County</label>
              <input
                type="text"
                value={newProject.county}
                onChange={(e) => setNewProject({...newProject, county: e.target.value})}
                placeholder="County"
              />
            </div>
            <div className="form-group">
              <label>Sub-county</label>
              <input
                type="text"
                value={newProject.sub_county}
                onChange={(e) => setNewProject({...newProject, sub_county: e.target.value})}
                placeholder="Sub-county"
              />
            </div>
            <div className="form-group">
              <label>Ward</label>
              <input
                type="text"
                value={newProject.ward}
                onChange={(e) => setNewProject({...newProject, ward: e.target.value})}
                placeholder="Ward"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Budget (KSh)</label>
              <input
                type="number"
                value={newProject.budget}
                onChange={(e) => setNewProject({...newProject, budget: Number(e.target.value)})}
                placeholder="Budget amount"
              />
            </div>
            <div className="form-group">
              <label>Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={newProject.progress_percentage}
                onChange={(e) => setNewProject({...newProject, progress_percentage: Number(e.target.value)})}
              />
            </div>
            <div className="form-group">
              <label>Media URL</label>
              <input
                type="text"
                value={newProject.media_url || ''}
                onChange={(e) => setNewProject({...newProject, media_url: e.target.value})}
                placeholder="Image/video URL"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={newProject.description}
              onChange={(e) => setNewProject({...newProject, description: e.target.value})}
              placeholder="Project description"
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
              disabled={!newProject.title || !newProject.description || !newProject.responsible_officer}
            >
              Create Project
            </button>
          </div>
        </div>
      )}

      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id} className={`project-card ${project.status}`}>
            {editingId === project.id ? (
              <div className="edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Title</label>
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => setEditData({...editData, title: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Responsible Officer</label>
                    <input
                      type="text"
                      value={editData.responsible_officer || ''}
                      onChange={(e) => setEditData({...editData, responsible_officer: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={editData.start_date || ''}
                      onChange={(e) => setEditData({...editData, start_date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={editData.end_date || ''}
                      onChange={(e) => setEditData({...editData, end_date: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={editData.status || ''}
                      onChange={(e) => setEditData({...editData, status: e.target.value})}
                    >
                      {statusOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Progress (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editData.progress_percentage || 0}
                      onChange={(e) => setEditData({...editData, progress_percentage: Number(e.target.value)})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Media URL</label>
                    <input
                      type="text"
                      value={editData.media_url || ''}
                      onChange={(e) => setEditData({...editData, media_url: e.target.value})}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={editData.description || ''}
                    onChange={(e) => setEditData({...editData, description: e.target.value})}
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
                    onClick={() => saveEdit(project.id)}
                    className="btn btn--save"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="project-card__header">
                  <h3 className="project-card__title">{project.title}</h3>
                  <div className="project-card__actions">
                    <button
                      onClick={() => startEditing(project)}
                      className="btn btn--edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="btn btn--delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                <div className="project-card__meta">
                  <div className="meta-item">
                    <FaUserTie className="meta-icon" />
                    <span>{project.responsible_officer}</span>
                  </div>
                  <div className="meta-item">
                    <FaCalendarAlt className="meta-icon" />
                    <span>
                      {new Date(project.start_date).toLocaleDateString()} - {' '}
                      {new Date(project.end_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaMapMarkerAlt className="meta-icon" />
                    <span>
                      {project.ward}, {project.sub_county}, {project.county}
                    </span>
                  </div>
                  <div className="meta-item">
                    <FaMoneyBillWave className="meta-icon" />
                    <span>KSh {project.budget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="project-card__status">
                  <span className={`status-badge ${project.status}`}>
                    {project.status}
                  </span>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${project.progress_percentage}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">
                      <FiPercent /> {project.progress_percentage}%
                    </span>
                  </div>
                </div>

                <p className="project-card__description">{project.description}</p>

                {project.media_url && (
                  <div className="project-card__media">
                    <img 
                      src={project.media_url} 
                      alt={project.title}
                      className="project-image"
                    />
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminProjects;