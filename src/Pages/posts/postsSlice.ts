import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import CloudinaryService from '../../cloudinary/cloudinary';
import { LocalURL } from '../../utils';

// Interfaces
export interface MediaFile {
  id?: string;
  url: string;
  public_id: string;
}

export interface Post {
  id?: string;
  content: string; 
  media?: MediaFile;
  user_id?: string;
  created_at?: Date;
  comments?: Comment[];
}

export interface Comment {
  id?: string;
  content: string;
  user_id?: string;
  post_id?: string;
  likes?: number;
  dislikes?: number;
}

// Async Thunks
export const createPost = createAsyncThunk(
  'posts/createPost',
  async ({ content, file }: { content: string; file?: File }, { rejectWithValue }) => {
    try {
      // Upload media if file exists
      let mediaFile: MediaFile | undefined;
      if (file) {
        const uploadResult = await CloudinaryService.uploadImage(file);
        
        if ('message' in uploadResult) {
          return rejectWithValue(uploadResult.message);
        }
        
        mediaFile = {
          url: uploadResult.url,
          public_id: uploadResult.id
        };
      }

      // Create post on backend
      const response = await axios.post(`${LocalURL}/api/posts`, { 
        content, 
        media: mediaFile 
      });

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create post');
    }
  }
);

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LocalURL}/api/posts`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to fetch posts');
    }
  }
);

export const createComment = createAsyncThunk(
  'posts/createComment',
  async ({ postId, content }: { postId: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${LocalURL}/api/posts/${postId}/comments`, { content });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to create comment');
    }
  }
);

export const likeComment = createAsyncThunk(
  'posts/likeComment',
  async ({ 
    commentId, 
    postId, 
    isLike 
  }: { 
    commentId: string; 
    postId: string; 
    isLike: boolean 
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${LocalURL}/api/posts/${postId}/comments/${commentId}/like`, { 
        isLike 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to like comment');
    }
  }
);

// Slice
const postSlice = createSlice({
  name: 'posts',
  initialState: {
    items: [] as Post[],
    status: 'idle',
    error: null as string | null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch Posts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Create Comment
      .addCase(createComment.fulfilled, (state, action) => {
        const postIndex = state.items.findIndex(
          post => post.id === action.payload.post_id
        );
        if (postIndex !== -1) {
          state.items[postIndex].comments?.push(action.payload);
        }
      })
      
      // Like Comment
      .addCase(likeComment.fulfilled, (state, action) => {
        const postIndex = state.items.findIndex(
          post => post.id === action.payload.post_id
        );
        if (postIndex !== -1) {
          const commentIndex = state.items[postIndex].comments?.findIndex(
            comment => comment.id === action.payload.id
          );
          if (commentIndex !== -1 && commentIndex !== undefined) {
            state.items[postIndex].comments![commentIndex] = action.payload;
          }
        }
      });
  }
});

export default postSlice.reducer;