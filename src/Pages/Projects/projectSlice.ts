import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../utils';
import CloudinaryService from '../../cloudinary/cloudinary';

// Define types for interactions
export interface Comment {
  id?: number;
  username?: string;
  project_id: number;
  user_id: number;
  content: string;
}

export interface Feedback {
  id?: number;
  project_id: number;
  title: string;
  description: string;
  evidence_url?: string;
  evidence_image?: string;
  reported_by?: number;
}

// Enhanced Project type with interaction data
export interface Project {
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
}

const initialState: ProjectState = {
  projects: [],
  loading: false,
  error: null
};

// Async thunk to fetch projects with comments and feedback
export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await axios.get(`${LocalURL}/projects`);
  const projects = response.data;

  const commentsResponse = await axios.get(`${LocalURL}/comments`);
  const comments = Array.isArray(commentsResponse.data) ? commentsResponse.data : [];

  const feedbackResponse = await axios.get(`${LocalURL}/feedback`);
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

// Async thunk to add a project
export const addProject = createAsyncThunk('projects/addProject', async (project: Project) => {
  const response = await axios.post(`${LocalURL}/projects`, project);
  return response.data;
});

// Async thunk to add a comment
export const addComment = createAsyncThunk('projects/addComment', 
  async (comment: Omit<Comment, 'user_id'>) => {
    const userId = Number(localStorage.getItem('userId'));
    const username = localStorage.getItem('username');
    
    return axios.post(`${LocalURL}/comments`, { 
      ...comment, 
      user_id: userId,
      username: username || 'Anonymous'
    }).then(res => res.data);
  }
);

// Interface for Feedback Submission
interface FeedbackSubmission {
  project_id: number;
  title: string;
  description: string;
  evidence_url?: string;
  evidence_image?: File | null;
}

// Async thunk to add feedback with Cloudinary upload
export const addFeedback = createAsyncThunk<
  Feedback,  // Return type
  FeedbackSubmission,  // Argument type
  { rejectValue: string }  // Thunk config
>('projects/addFeedback', 
  async (feedbackData, { rejectWithValue }) => {
    try {
      const userId = Number(localStorage.getItem('userId'));
      let evidenceUrl = feedbackData.evidence_url;
      let evidenceFile = feedbackData.evidence_image;

      // Upload image to Cloudinary if file exists
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
          return rejectWithValue('Failed to upload evidence');
        }
      }
    
      // Prepare feedback payload
      const payload: Feedback = { 
        project_id: feedbackData.project_id,
        title: feedbackData.title,
        description: feedbackData.description,
        evidence_url: evidenceUrl,
        reported_by: userId
      };
    
      // Send to backend
      const response = await axios.post(`${LocalURL}/feedback`, payload);
      return response.data;
    } catch (error) {
      console.error('Feedback submission error:', error);
      return rejectWithValue('Failed to submit feedback');
    }
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
        
        // Ensure other reactions are mutually exclusive
        if (project.userLiked) {
          project.userDisliked = false;
          project.dislikeCount = project.userDisliked ? project.dislikeCount + 1 : project.dislikeCount - 1;
        }
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
        
        // Ensure other reactions are mutually exclusive
        if (project.userDisliked) {
          project.userLiked = false;
          project.likeCount = project.userLiked ? project.likeCount + 1 : project.likeCount - 1;
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
        state.projects.push(action.payload);
      })
      .addCase(addProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add project';
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
      .addCase(addFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedback.fulfilled, (state, action: PayloadAction<Feedback>) => {
        const { project_id } = action.payload;
        const project = state.projects.find(p => p.id === project_id);
        
        if (project) {
          if (!project.feedbacks) {
            project.feedbacks = [];
          }
          project.feedbacks.push(action.payload);
          state.loading = false;
        }
      })
      .addCase(addFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to submit feedback';
      });
  },
});

export const { toggleLike, toggleLove, toggleDislike } = projectSlice.actions;
export default projectSlice.reducer;