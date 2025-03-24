import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../app/store';
import { createContent, updateContent, fetchContentById, clearCurrentItem } from './contentSlice';
import CloudinaryService from '../../cloudinary/cloudinary';
import '../../styles/content.scss';
import UserNavbar from '../userNavbar';
import Footer from '../Footer';


// Content types dropdown options
const contentTypes = [
  { value: 'article', label: 'Article' },
  { value: 'video', label: 'Video' },
  { value: 'infographic', label: 'Infographic' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'quiz', label: 'Quiz' }
];

const EducationalContentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { currentItem, loading, error } = useSelector((state: RootState) => state.education);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    content_type: 'article',
    image_url: '',
    created_by: Number(localStorage.getItem("userId")) || 0, // Default value or get from auth context
  });
  
  // File upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Initialize form data if editing existing content
  useEffect(() => {
    if (id) {
      dispatch(fetchContentById(parseInt(id)));
    } else {
      dispatch(clearCurrentItem());
    }
    
    return () => {
      dispatch(clearCurrentItem());
    };
  }, [id, dispatch]);
  
  // Populate form when currentItem changes
  useEffect(() => {
    if (currentItem) {
      setFormData({
        title: currentItem.title,
        content: currentItem.content,
        content_type: currentItem.content_type,
        image_url: currentItem.image_url || '',
        created_by: Number(localStorage.getItem("userId")),
      });
      
      if (currentItem.image_url) {
        setImagePreview(currentItem.image_url);
      }
    }
  }, [currentItem]);
  
  // Handle form input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  // Handle image selection
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (): Promise<string | null> => {
    if (!imageFile) return formData.image_url || null;
    
    setUploadLoading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    try {
      // Directly upload to Cloudinary from the frontend
      const uploadResult = await CloudinaryService.uploadImage(imageFile);
      
      if ('url' in uploadResult) {
        // Update the form data with the new image URL
        setFormData(prev => ({
          ...prev,
          image_url: uploadResult.url
        }));
        setUploadProgress(100);
        return uploadResult.url;
      } else {
        setUploadError(uploadResult.message);
        return null;
      }
    } catch (error) {
      setUploadError('Failed to upload image');
      return null;
    } finally {
      setUploadLoading(false);
    }
  };
  
  // Remove current image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Upload image if there's a new one
    let imageUrl = formData.image_url;
    if (imageFile) {
      const uploadedUrl = await handleImageUpload();
      if (!uploadedUrl) {
        // Upload failed, don't proceed
        return;
      }
      imageUrl = uploadedUrl;
    }
    
    // Create submission data
    const submissionData = {
      ...formData,
      image_url: imageUrl
    };
    
    // Create or update content
    try {
      if (id) {
        await dispatch(updateContent({ id: parseInt(id), contentData: submissionData })).unwrap();
      } else {
        await dispatch(createContent(submissionData as any)).unwrap();
      }
      // Redirect to content list on success
      navigate('/dashboard');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };
  
  const handleNavigation = (view: string) => {
    switch (view) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'education':
        navigate('/content');
        break;
      case 'content':
        navigate('/content');
        break;
      default:
        console.warn(`Unknown view: ${view}`);
    }
  };
  return (
    <div>
      <UserNavbar handleNavigation={handleNavigation}/>
    
    <div className="education-form-container">
      <h1>{id ? 'Edit Educational Content' : 'Create Educational Content'}</h1>
      
      {error && <div className="error-message">{error}</div>}
      {uploadError && <div className="error-message">{uploadError}</div>}
      
      <form onSubmit={handleSubmit} className="education-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="form-control"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content_type">Content Type</label>
          <select
            id="content_type"
            name="content_type"
            value={formData.content_type}
            onChange={handleChange}
            required
            className="form-control"
          >
            {contentTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            className="form-control content-textarea"
            rows={10}
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="image">Image</label>
          <div className="image-upload-container">
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
              className="image-input"
            />
            <label htmlFor="image" className="image-upload-btn">
              Choose Image
            </label>
            
            {uploadLoading && (
              <div className="upload-progress">
                <div 
                  className="progress-bar" 
                  style={{ width: `${uploadProgress}%` }}
                ></div>
                <span>{uploadProgress}%</span>
              </div>
            )}
            
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Preview" />
                <button 
                  type="button" 
                  onClick={handleRemoveImage}
                  className="btn-remove-image"
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/education')}
            className="btn-cancel"
            disabled={loading || uploadLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-submit"
            disabled={loading || uploadLoading}
          >
            {loading || uploadLoading ? 'Processing...' : id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
    <Footer/>
    </div>
  );
};

export default EducationalContentForm;