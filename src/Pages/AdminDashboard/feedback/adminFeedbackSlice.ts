import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../../utils';

interface Feedback {
  id: number;
  title: string;
  description: string;
  evidence_url?: string;
  reported_by: number;
  reporter_name?: string;
  project_id: number;
  project_title?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AdminFeedbackState {
  feedbacks: Feedback[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminFeedbackState = {
  feedbacks: [],
  loading: false,
  error: null
};

export const fetchAllFeedback = createAsyncThunk(
  'adminFeedback/fetchAll',
  async () => {
    const response = await axios.get(`${LocalURL}/feedback`);
    return response.data;
  }
);

export const deleteFeedback = createAsyncThunk(
  'adminFeedback/deleteFeedback',
  async (id: number) => {
    await axios.delete(`${LocalURL}/feedback/${id}`);
    return id;
  }
);

export const updateFeedbackStatus = createAsyncThunk(
  'adminFeedback/updateStatus',
  async ({ id, status }: { id: number; status: string }) => {
    const response = await axios.put(`${LocalURL}/feedback/${id}`, { status });
    return response.data;
  }
);

const adminFeedbackSlice = createSlice({
  name: 'adminFeedback',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchAllFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch feedback';
      })
      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.feedbacks = state.feedbacks.filter(feedback => feedback.id !== action.payload);
      })
      .addCase(updateFeedbackStatus.fulfilled, (state, action) => {
        const index = state.feedbacks.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.feedbacks[index] = action.payload;
        }
      });
  }
});

export default adminFeedbackSlice.reducer;