import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../../utils';

interface User {
  id: number;
  username: string;
  email: string;
  profile_photo?: string;
  county: string;
  sub_county: string;
  ward: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface AdminUsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  users: [],
  loading: false,
  error: null
};

export const fetchAllUsers = createAsyncThunk(
  'adminUsers/fetchAll',
  async () => {
    const response = await axios.get(`${LocalURL}/users`);
    return response.data;
  }
);

export const deleteUser = createAsyncThunk(
  'adminUsers/deleteUser',
  async (id: number) => {
    await axios.delete(`${LocalURL}/users/${id}`);
    return id;
  }
);

export const updateUserRole = createAsyncThunk(
  'adminUsers/updateRole',
  async ({ id, role }: { id: number; role: string }) => {
    const response = await axios.put(`${LocalURL}/users/${id}`, { role });
    return response.data;
  }
);

export const resetUserPassword = createAsyncThunk(
  'adminUsers/resetPassword',
  async (email: string) => {
    const response = await axios.post(`${LocalURL}/reset-password`, { email });
    return response.data;
  }
);

const adminUsersSlice = createSlice({
  name: 'adminUsers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user.id !== action.payload);
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(resetUserPassword.pending, () => {
        // Optional: Add loading state for password reset if needed
      })
      .addCase(resetUserPassword.fulfilled, () => {
        // Password reset successful - may not need state changes
      })
      .addCase(resetUserPassword.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to reset password';
      });
  }
});

export default adminUsersSlice.reducer;