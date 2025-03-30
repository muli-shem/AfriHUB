import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../../utils';

export interface Project {
  id: number;
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
  created_at: string;
  updated_at: string;
}

interface AdminProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminProjectsState = {
  projects: [],
  loading: false,
  error: null
};

export const fetchAllProjects = createAsyncThunk(
  'adminProjects/fetchAll',
  async () => {
    const response = await axios.get(`${LocalURL}/projects`);
    return response.data;
  }
);

export const createProject = createAsyncThunk(
  'adminProjects/createProject',
  async (projectData: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await axios.post(`${LocalURL}/projects`, projectData);
    return response.data;
  }
);

export const updateProject = createAsyncThunk(
  'adminProjects/updateProject',
  async ({ id, projectData }: { id: number; projectData: Partial<Project> }) => {
    const response = await axios.put(`${LocalURL}/projects/${id}`, projectData);
    return response.data;
  }
);

export const deleteProject = createAsyncThunk(
  'adminProjects/deleteProject',
  async (id: number) => {
    await axios.delete(`${LocalURL}/projects/${id}`);
    return id;
  }
);

const adminProjectsSlice = createSlice({
  name: 'adminProjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchAllProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.unshift(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
      });
  }
});

export default adminProjectsSlice.reducer;