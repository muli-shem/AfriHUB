import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../utils';
import CloudinaryService from '../../cloudinary/cloudinary';

// Define types for interactions
interface Comment {
  id?: number;
  post_id: number;
  user_id: number;
  user_name?: string;
  content: string;
  created_at?: string;
}

// Enhanced Project type with interaction data
interface Project {
  id?: number;
  title: string;
  description: string;
  responsible_officer: string;
  status: string;
  start_date: string;
  end_date: string;
  county: string;
  sub_county: string;
  ward: string;
  budget: number;
  progress_percentage: number;
  media_url?: string;
  
  // Interaction-related fields
  comments?: Comment[];
  likeCount: number;
  loveCount: number;
  dislikeCount: number;
  userLiked: boolean;
  userLoved: boolean;
  userDisliked: boolean;
}

interface Feedback {
  title: string;
  description: string;
  evidence_url?: string;
  reported_by: number;
  project_id: number;
}

// Define the initial state
interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  uploadingImage: boolean;
  uploadError: string | null;
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null,
  uploadingImage: false,
  uploadError: null
};


// Async thunk to fetch projects with interaction data
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await axios.get(`${LocalURL}/projects`);
  const projects = response.data;
  
  // Fetch comments for each project
  const commentsResponse = await axios.get(`${LocalURL}/comments`);
  const comments = commentsResponse.data || [];
  
  // Initialize projects with interaction data
  return projects.map((project: Project) => ({
    ...project,
    comments: comments.filter((comment: Comment) => comment.post_id === project.id),
    likeCount: project.likeCount || 0,
    loveCount: project.loveCount || 0,
    dislikeCount: project.dislikeCount || 0,
    userLiked: false,
    userLoved: false,
    userDisliked: false
  }));
});

// Async thunk to add a project
export const addProject = createAsyncThunk('projects/addProject', async (project: Project) => {
  const response = await axios.post(`${LocalURL}/projects`, project);
  return response.data;
});

// Async thunk to add a comment
export const addComment = createAsyncThunk('projects/addComment', 
  async (comment: Comment) => {
    const response = await axios.post(`${LocalURL}/comments`, comment);
    
    // Get user information to display in UI
    try {
      const userData = localStorage.getItem('user');
      let userName = 'Anonymous';
      
      if (userData) {
        const user = JSON.parse(userData);
        userName = user.name || 'Anonymous';
      }
      
      return { ...response.data, user_name: userName };
    } catch (error) {
      console.error('Error getting user data:', error);
      return { ...response.data, user_name: 'Anonymous' };
    }
  }
);

// Async thunk to upload image for feedback
export const uploadFeedbackImage = createAsyncThunk(
  'projects/uploadFeedbackImage',
  async (file: File) => {
    const result = await CloudinaryService.uploadImage(file);
    
    if ('message' in result) {
      throw new Error(result.message);
    }
    
    return result.url;
  }
);

// Async thunk to add feedback
export const addFeedback = createAsyncThunk(
  'projects/addFeedback', 
  async (feedback: Feedback) => {
    const response = await axios.post(`${LocalURL}/feedback`, feedback);
    return response.data;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Frontend-only like functionality
    toggleLike: (state, action: PayloadAction<{projectId: number, userId: number}>) => {
      const { projectId } = action.payload;
      // userId is not used in this function but is kept in the payload type for consistency
      
      const project = state.projects.find(p => p.id === projectId);
      
      if (project) {
        if (project.userLiked) {
          project.likeCount = Math.max(0, project.likeCount - 1);
          project.userLiked = false;
        } else {
          project.likeCount += 1;
          project.userLiked = true;
          
          // Remove other reactions if present
          if (project.userLoved) {
            project.loveCount = Math.max(0, project.loveCount - 1);
            project.userLoved = false;
          }
          if (project.userDisliked) {
            project.dislikeCount = Math.max(0, project.dislikeCount - 1);
            project.userDisliked = false;
          }
        }
      }
    },
    
    // Frontend-only love functionality
    toggleLove: (state, action: PayloadAction<{projectId: number, userId: number}>) => {
      const { projectId } = action.payload;
      // userId is not used in this function but is kept in the payload type for consistency
      
      const project = state.projects.find(p => p.id === projectId);
      
      if (project) {
        if (project.userLoved) {
          project.loveCount = Math.max(0, project.loveCount - 1);
          project.userLoved = false;
        } else {
          project.loveCount += 1;
          project.userLoved = true;
          
          // Remove other reactions if present
          if (project.userLiked) {
            project.likeCount = Math.max(0, project.likeCount - 1);
            project.userLiked = false;
          }
          if (project.userDisliked) {
            project.dislikeCount = Math.max(0, project.dislikeCount - 1);
            project.userDisliked = false;
          }
        }
      }
    },
    
    // Frontend-only dislike functionality
    toggleDislike: (state, action: PayloadAction<{projectId: number, userId: number}>) => {
      const { projectId } = action.payload;
      // userId is not used in this function but is kept in the payload type for consistency
      
      const project = state.projects.find(p => p.id === projectId);
      
      if (project) {
        if (project.userDisliked) {
          project.dislikeCount = Math.max(0, project.dislikeCount - 1);
          project.userDisliked = false;
        } else {
          project.dislikeCount += 1;
          project.userDisliked = true;
          
          // Remove other reactions if present
          if (project.userLiked) {
            project.likeCount = Math.max(0, project.likeCount - 1);
            project.userLiked = false;
          }
          if (project.userLoved) {
            project.loveCount = Math.max(0, project.loveCount - 1);
            project.userLoved = false;
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action: PayloadAction<Project[]>) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      
      // Add project
      .addCase(addProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProject.fulfilled, (state, action: PayloadAction<Project>) => {
        state.loading = false;
        // Initialize reaction counts and states
        const newProject = {
          ...action.payload,
          likeCount: 0,
          loveCount: 0,
          dislikeCount: 0,
          userLiked: false,
          userLoved: false,
          userDisliked: false
        };
        state.projects.push(newProject);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add project';
      })
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const { post_id } = action.payload;
        const project = state.projects.find(p => p.id === post_id);
        
        if (project) {
          if (!project.comments) {
            project.comments = [];
          }
          project.comments.push(action.payload);
        }
      })
      
      // Upload feedback image
      .addCase(uploadFeedbackImage.pending, (state) => {
        state.uploadingImage = true;
        state.uploadError = null;
      })
      .addCase(uploadFeedbackImage.fulfilled, (state) => {
        state.uploadingImage = false;
      })
      .addCase(uploadFeedbackImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.uploadError = action.error.message || 'Failed to upload image';
      })
      
      // Feedback doesn't need to update UI state as it's just reported
      .addCase(addFeedback.fulfilled, () => {
        // No state changes needed
      });
  },
});

export const { toggleLike, toggleLove, toggleDislike } = projectSlice.actions;
export default projectSlice.reducer;