import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../utils';


// Types
interface EducationalContent {
  id: number;
  title: string;
  content: string;
  image_url: string | null;
  content_type: string;
  created_by: number;
}

interface EducationalContentState {
  items: EducationalContent[];
  currentItem: EducationalContent | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: EducationalContentState = {
  items: [],
  currentItem: null,
  loading: false,
  error: null
};

// Async thunks
export const fetchAllContent = createAsyncThunk(
  'education/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LocalURL}/education`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const fetchContentById = createAsyncThunk(
  'education/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LocalURL}/education/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch content');
    }
  }
);

export const createContent = createAsyncThunk(
  'education/create',
  async (contentData: Omit<EducationalContent, 'id' | 'created_at' | 'updated_at'>, { rejectWithValue }) => {
    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }
      const response = await axios.post(`${LocalURL}/education`, contentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create content');
    }
  }
);

export const updateContent = createAsyncThunk(
  'education/update',
  async ({ id, contentData }: { id: number, contentData: Partial<EducationalContent> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${LocalURL}/education/${id}`, contentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update content');
    }
  }
);

export const deleteContent = createAsyncThunk(
  'education/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${LocalURL}/education/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete content');
    }
  }
);

// Slice
const educationSlice = createSlice({
  name: 'education',
  initialState,
  reducers: {
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearErrors: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all content
      .addCase(fetchAllContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllContent.fulfilled, (state, action: PayloadAction<EducationalContent[]>) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAllContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch content by id
      .addCase(fetchContentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContentById.fulfilled, (state, action: PayloadAction<EducationalContent>) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchContentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create content
      .addCase(createContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContent.fulfilled, (state, action: PayloadAction<EducationalContent>) => {
        state.loading = false;
        state.items.push(action.payload);
      })
      .addCase(createContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update content
      .addCase(updateContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContent.fulfilled, (state, action: PayloadAction<EducationalContent>) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.currentItem = action.payload;
      })
      .addCase(updateContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete content
      .addCase(deleteContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteContent.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearCurrentItem, clearErrors } = educationSlice.actions;
export default educationSlice.reducer;