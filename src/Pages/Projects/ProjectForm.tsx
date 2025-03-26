import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { addProject } from './projectSlice';
import CloudinaryService from '../../cloudinary/cloudinary';
import '../../styles/ProjectForm.scss';
import Footer from '../Footer';
import Navbar from '../../components/Navbar';

const ProjectForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>(); // Type your dispatch
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsible_officer: '',
    status: 'ongoing',
    start_date: '',
    end_date: '',
    county: '',
    sub_county: '',
    ward: '',
    budget: 0,
    progress_percentage: 0,
    media_url: '',
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let mediaUrl = formData.media_url;

      if (imageFile) {
        const uploadResult = await CloudinaryService.uploadImage(imageFile);

        if ('message' in uploadResult) {
          setUploadError(uploadResult.message);
          return;
        }

        mediaUrl = uploadResult.url;
      }

      const project = { 
        ...formData, 
        media_url: mediaUrl,
        likeCount: 0,
        loveCount: 0,
        dislikeCount: 0,
        userLiked: false,
        userLoved: false,
        userDisliked: false
      };

      await dispatch(addProject(project)).unwrap(); // Awaiting the promise for better error handling
      alert('Project added successfully!');

      setFormData({
        title: '',
        description: '',
        responsible_officer: '',
        status: 'ongoing',
        start_date: '',
        end_date: '',
        county: '',
        sub_county: '',
        ward: '',
        budget: 0,
        progress_percentage: 0,
        media_url: '',
      });
      setImageFile(null);
      setUploadError(null);
    } catch (error) {
      console.error('Error adding project:', error);
      setUploadError('Failed to add project');
    }
  };

  return (
    <div>
      <Navbar/>
    <form onSubmit={handleSubmit} className="project-form">
      <h2>Add New Project</h2>
      {uploadError && <div className="error-message">{uploadError}</div>}
      <div className="form-group">
        <label>Title</label>
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Description</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Responsible Officer</label>
        <input type="text" name="responsible_officer" value={formData.responsible_officer} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Status</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
          <option value="stalled">Stalled</option>
        </select>
      </div>
      <div className="form-group">
        <label>Start Date</label>
        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>End Date</label>
        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>County</label>
        <input type="text" name="county" value={formData.county} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Sub-County</label>
        <input type="text" name="sub_county" value={formData.sub_county} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Ward</label>
        <input type="text" name="ward" value={formData.ward} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Budget</label>
        <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Progress Percentage</label>
        <input type="number" name="progress_percentage" value={formData.progress_percentage} onChange={handleChange} required />
      </div>
      <div className="form-group">
        <label>Project Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button type="submit">Add Project</button>
    </form>
    <Footer/>
    </div>
  );
};

export default ProjectForm;
