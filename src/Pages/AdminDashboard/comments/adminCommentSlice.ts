// First, let's update the adminCommentSlice.ts file:

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../../utils';

interface Comment {
  id: number;
  user_id: number;
  username?: string;
  project_id: number;
  project_title?: string;
  content: string;
  created_at: string;
  updated_at: string;
}

interface AdminCommentsState {
  comments: Comment[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCommentsState = {
  comments: [],
  loading: false,
  error: null
};

// Explicitly type the return values from the async thunks
export const fetchAllComments = createAsyncThunk<Comment[]>(
  'adminComments/fetchAll',
  async () => {
    const response = await axios.get(`${LocalURL}/comments`);
    return response.data;
  }
);

export const deleteComment = createAsyncThunk<number, number>(
  'adminComments/deleteComment',
  async (id: number) => {
    await axios.delete(`${LocalURL}/comments/${id}`);
    return id;
  }
);

export const updateComment = createAsyncThunk<Comment, { id: number; content: string }>(
  'adminComments/updateComment',
  async ({ id, content }: { id: number; content: string }) => {
    const response = await axios.put(`${LocalURL}/comments/${id}`, { content });
    return response.data;
  }
);

const adminCommentsSlice = createSlice({
  name: 'adminComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllComments.fulfilled, (state, action: PayloadAction<Comment[]>) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<number>) => {
        state.comments = state.comments.filter(comment => comment.id !== action.payload);
      })
      .addCase(updateComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const index = state.comments.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.comments[index] = action.payload;
        }
      });
  }
});

export default adminCommentsSlice.reducer;