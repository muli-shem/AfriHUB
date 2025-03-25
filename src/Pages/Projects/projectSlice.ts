import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../utils';
import CloudinaryService from '../../cloudinary/cloudinary';

// Define types for interactions
interface Comment {
  id?: number;
  project_id: number;
  user_id: number;
  content: string;
}

interface Feedback {
  id?: number;
  title: string;
  description: string;
  evidence_url?: string;
  reported_by: number;
  project_id: number;
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
  feedbacks?: Feedback[];
  likeCount: number;
  loveCount: number;
  dislikeCount: number;
  userLiked: boolean;
  userLoved: boolean;
  userDisliked: boolean;
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

// Async thunk to fetch projects with comments and feedback
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await axios.get(`${LocalURL}/projects`);
  const projects = response.data;

  const commentsResponse = await axios.get(`${LocalURL}/comments`);
  console.log("Comments API Response:", commentsResponse.data);
  const comments = Array.isArray(commentsResponse.data) ? commentsResponse.data : [];

  const feedbackResponse = await axios.get(`${LocalURL}/feedback`);
  console.log("Feedback API Response:", feedbackResponse.data);
  const feedbacks = Array.isArray(feedbackResponse.data) ? feedbackResponse.data : [];

  return projects.map((project: Project) => ({
    ...project,
    comments: comments.filter((comment: Comment) => comment.project_id === project.id),
    feedbacks: feedbacks.filter((feedback: Feedback) => feedback.project_id === project.id),
    likeCount: project.likeCount || 0,
    loveCount: project.loveCount || 0,
    dislikeCount: project.dislikeCount || 0,
    userLiked: false,
    userLoved: false,
    userDisliked: false
  }));
});

export const addProject = createAsyncThunk('projects/addProject', async (project: Project) => {
  const response = await axios.post(`${LocalURL}/projects`, project);
  return response.data;
});
// Async thunk to add a comment
export const addComment = createAsyncThunk('projects/addComment', 
  async (comment: Omit<Comment, 'user_id'>) => {
    const userId = Number(localStorage.getItem('userId'));
    return axios.post(`${LocalURL}/comments`, { ...comment, user_id: userId }).then(res => res.data);
  }
);

// Async thunk to add feedback with Cloudinary upload
export const addFeedback = createAsyncThunk(
  'projects/addFeedback', 
  async (feedback: Omit<Feedback, 'reported_by'>) => {
    const userId = Number(localStorage.getItem('userId'));
    let evidenceFile: File | null = null;

    if (feedback.evidence_url) {
      try {
        const response = await fetch(feedback.evidence_url);
        const blob = await response.blob();
        evidenceFile = new File([blob], 'evidence.png', { type: blob.type });
      } catch (error) {
        console.error('Error fetching evidence file:', error);
      }
    }

    let evidenceUrl = feedback.evidence_url;
    if (evidenceFile) {
      try {
        const uploadResponse = await CloudinaryService.uploadImage(evidenceFile);
        if ('url' in uploadResponse) {
          evidenceUrl = uploadResponse.url;
        } else {
          throw new Error(uploadResponse.message);
        }
      } catch (error) {
        console.error('Cloudinary upload failed:', error);
        throw new Error('Failed to upload evidence');
      }
    }
    
    const response = await axios.post(`${LocalURL}/feedback`, { 
      ...feedback, 
      reported_by: userId,
      evidence_url: evidenceUrl
    });
    return response.data;
  }
);

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    toggleLike: (state, action: PayloadAction<number>) => {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        project.userLiked = !project.userLiked;
        project.likeCount += project.userLiked ? 1 : -1;
      }
    },
    toggleLove: (state, action: PayloadAction<number>) => {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        project.userLoved = !project.userLoved;
        project.loveCount += project.userLoved ? 1 : -1;
      }
    },
    toggleDislike: (state, action: PayloadAction<number>) => {
      const project = state.projects.find(p => p.id === action.payload);
      if (project) {
        project.userDisliked = !project.userDisliked;
        project.dislikeCount += project.userDisliked ? 1 : -1;
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
      
      // Add comment
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const { project_id } = action.payload;
        const project = state.projects.find(p => p.id === project_id);
        
        if (project) {
          if (!project.comments) {
            project.comments = [];
          }
          project.comments.push(action.payload);
        }
      })
      
      // Add feedback
      .addCase(addFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        const { project_id } = action.payload;
        const project = state.projects.find(p => p.id === project_id);
        
        if (project) {
          if (!project.feedbacks) {
            project.feedbacks = [];
          }
          project.feedbacks.push(action.payload);
        }
      });
  },
});

export const { toggleLike, toggleLove, toggleDislike } = projectSlice.actions;
export default projectSlice.reducer;
