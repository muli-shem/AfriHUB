import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { LocalURL } from '../../utils';

// Interface remains the same
interface UserProfileState {
  userData: {
    id?: string | number;
    username: string;
    email: string;
    county: string;
    subCounty: string;
    ward: string;
    profilePhoto: string;
  };
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserProfileState = {
  userData: {
    username: '',
    email: '',
    county: '',
    subCounty: '',
    ward: '',
    profilePhoto: ''
  },
  loading: 'idle',
  error: null
};

// Enhanced fetch user profile thunk
export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LocalURL}/users/${userId}`);
      console.log('Fetch Profile Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Fetch Profile Error:', error.response?.data || error.message);
      return rejectWithValue(error.response?.data || 'Failed to fetch user profile');
    }
  }
);

// Enhanced update user profile thunk
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { 
      userId, 
      profileData 
    }: { 
      userId: string, 
      profileData: Partial<UserProfileState['userData']> 
    }, 
    { rejectWithValue }
  ) => {
    try {
      console.log('Updating Profile - Input Data:', {
        userId,
        profileData
      });

      // Ensure all fields are sent, even if some are empty
      const completeProfileData = {
        username: '',
        email: '',
        county: '',
        subCounty: '',
        ward: '',
        profilePhoto: '',
        ...profileData
      };

      const response = await axios.put(
        `${LocalURL}/users/${userId}`, 
        completeProfileData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Update Profile Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Update Profile Error:', {
        responseData: error.response?.data,
        responseStatus: error.response?.status,
        message: error.message,
        config: error.config
      });

      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Failed to update user profile'
      );
    }
  }
);

// Slice remains mostly the same
const userProfileSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    clearUserProfile: (state) => {
      state.userData = initialState.userData;
      state.loading = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Profile Cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.userData = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      
      // Update Profile Cases
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        // Completely replace userData with new data
        state.userData = { ...action.payload };
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  }
});

export const { clearUserProfile } = userProfileSlice.actions;
export default userProfileSlice.reducer;