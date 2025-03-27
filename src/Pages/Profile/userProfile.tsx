import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserProfile, fetchUserProfile } from './profileSlice';
import { RootState, AppDispatch } from '../../app/store';
import CloudinaryService from '../../cloudinary/cloudinary';
import './UserProfile.scss';

const UserProfile: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userData, loading, error } = useSelector((state: RootState) => state.userProfile);

  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    county: '',
    subCounty: '',
    ward: '',
    profilePhoto: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');

  // Fetch user profile on component mount
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserProfile(userId));
    }
  }, [dispatch, userId]);

  // Update local state when user data changes
  useEffect(() => {
    if (userData) {
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        county: userData.county || '',
        subCounty: userData.subCounty || '',
        ward: userData.ward || '',
        profilePhoto: userData.profilePhoto || ''
      });
    }
  }, [userData]);

  // Handle image file selection
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Invalid file type. Please upload JPEG, PNG, GIF, or WebP.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File is too large. Maximum size is 5MB.');
      return;
    }

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    setImageFile(file);
    setUploadError(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);
    setUploadProgress(null);

    // Validate form inputs
    if (!profileData.username.trim()) {
      setUploadError('Username is required');
      return;
    }

    if (!profileData.email.trim() || !validateEmail(profileData.email)) {
      setUploadError('Please enter a valid email address');
      return;
    }

    // Ensure userId is available
    if (!userId) {
      setUploadError('User ID not found. Please log in again.');
      return;
    }

    try {
      // Upload image to Cloudinary if a new image is selected
      let cloudinaryUrl = profileData.profilePhoto;
      if (imageFile) {
        // Reset previous states
        setUploadError(null);
        setUploadProgress(0);

        // Attempt Cloudinary upload with progress tracking
        const uploadResult = await CloudinaryService.uploadImage(
          imageFile, 
          (progress) => setUploadProgress(progress)
        );
        
        // Check if upload was successful
        if ('url' in uploadResult) {
          cloudinaryUrl = uploadResult.url;
          setUploadProgress(null); // Reset progress
        } else {
          // Set error if upload failed
          setUploadError(uploadResult.message);
          setUploadProgress(null);
          return;
        }
      }

      // Prepare submission data
      const submissionData = {
        ...profileData,
        profilePhoto: cloudinaryUrl
      };

      // Dispatch profile update with userId
      const result = await dispatch(updateUserProfile({ 
        userId, 
        profileData: submissionData 
      }));

      // Check if update was successful
      if (updateUserProfile.fulfilled.match(result)) {
        console.log('Profile updated successfully');
        // Optional: Add success toast or notification
      }
    } catch (error: any) {
      console.error('Profile update error:', {
        message: error.message,
        stack: error.stack,
        type: error.type
      });
      setUploadError('Failed to update profile. Please check your connection.');
    }
  };

  // Email validation helper
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Render the component
  return (
    <div className="user-profile-container">
      <div className="profile-card">
        <h2>User Profile</h2>
        
        {/* Image Upload Section */}
        <div className="profile-image-upload">
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden-input"
          />
          <div 
            className="image-preview"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage || profileData.profilePhoto ? (
              <img 
                src={previewImage || profileData.profilePhoto} 
                alt="Profile" 
                className="profile-image"
              />
            ) : (
              <div className="placeholder-icon">
                Upload Photo
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress Indicator */}
        {uploadProgress !== null && (
          <div className="upload-progress-container">
            <div 
              className="upload-progress-bar" 
              style={{ width: `${uploadProgress}%` }}
            >
              Uploading: {uploadProgress}%
            </div>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="county">County</label>
            <input
              id="county"
              type="text"
              name="county"
              value={profileData.county}
              onChange={handleInputChange}
              required
              placeholder="Enter your county"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subCounty">Sub County</label>
            <input
              id="subCounty"
              type="text"
              name="subCounty"
              value={profileData.subCounty}
              onChange={handleInputChange}
              required
              placeholder="Enter your sub county"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ward">Ward</label>
            <input
              id="ward"
              type="text"
              name="ward"
              value={profileData.ward}
              onChange={handleInputChange}
              required
              placeholder="Enter your ward"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading === 'pending' || uploadProgress !== null}
            className="submit-button"
          >
            {loading === 'pending' 
              ? 'Updating...' 
              : uploadProgress !== null 
                ? 'Uploading...' 
                : 'Update Profile'}
          </button>

          {/* Error Handling */}
          {(error || uploadError) && (
            <div className="error-message">
              {error || uploadError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UserProfile;