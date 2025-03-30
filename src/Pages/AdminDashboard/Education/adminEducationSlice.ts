import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../../utils'

interface EducationContent {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  content_type: string;
  created_by: number;
  creator_name?: string;
  created_at: string;
  updated_at: string;
}

interface AdminEducationState {
  contents: EducationContent[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminEducationState = {
  contents: [],
  loading: false,
  error: null
};

export const fetchAllEducationContent = createAsyncThunk(
  'adminEducation/fetchAll',
  async () => {
    const response = await axios.get(`${LocalURL}/education`);
    return response.data;
  }
);

export const deleteEducationContent = createAsyncThunk(
  'adminEducation/deleteContent',
  async (id: number) => {
    await axios.delete(`${LocalURL}/education/${id}`);
    return id;
  }
);

export const updateEducationContent = createAsyncThunk(
  'adminEducation/updateContent',
  async ({ id, contentData }: { id: number; contentData: Partial<EducationContent> }) => {
    const response = await axios.put(`${LocalURL}/education/${id}`, contentData);
    return response.data;
  }
);

export const createEducationContent = createAsyncThunk(
  'adminEducation/createContent',
  async (contentData: Omit<EducationContent, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await axios.post(`${LocalURL}/education`, contentData);
    return response.data;
  }
);

const adminEducationSlice = createSlice({
  name: 'adminEducation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEducationContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEducationContent.fulfilled, (state, action) => {
        state.loading = false;
        state.contents = action.payload;
      })
      .addCase(fetchAllEducationContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch education content';
      })
      .addCase(deleteEducationContent.fulfilled, (state, action) => {
        state.contents = state.contents.filter(content => content.id !== action.payload);
      })
      .addCase(updateEducationContent.fulfilled, (state, action) => {
        const index = state.contents.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contents[index] = action.payload;
        }
      })
      .addCase(createEducationContent.fulfilled, (state, action) => {
        state.contents.unshift(action.payload);
      });
  }
});

export default adminEducationSlice.reducer;