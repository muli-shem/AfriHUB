import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the shape of the auth state
interface LoginState {
    token: string | null;
    userId: string | null;
    userRole: string | null;
    loading: boolean;
    error: string | null;
}

// Define the initial state
const initialState: LoginState = {
    token: localStorage.getItem("token") || null,
    userId: localStorage.getItem("userId") || null,
    userRole: localStorage.getItem("userRole") || null,
    loading: false,
    error: null,
};

// Define the login thunk
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (credentials: { email: string; password: string }, { rejectWithValue }) => {
        console.log("Login Credentials:", credentials);
        try {
            // Log the complete request
            console.log("Making request to:", "http://localhost:8080/api/login");
            
            const response = await axios.post("http://localhost:8080/api/login", credentials);
            
            // Detailed response logging
            console.log("Full Response Object:", response);
            console.log("Response Data:", response.data);
            
            // Check if we have the expected response structure
            if (response.data && response.data.msg && response.data.msg.token && response.data.msg.user && response.data.msg.user.id) {
                // Extract token and user ID from the correct location
                const token = response.data.msg.token;
                const userId = response.data.msg.user.id.toString();
                const userRole = response.data.msg.user.role;
                
                console.log("Found token:", token);
                console.log("Found userId:", userId);
                console.log("Found userRole:", userRole);
                
                // Store in localStorage
                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                
                if (userRole) {
                    localStorage.setItem("userRole", userRole);
                }
                
                return { token, userId, userRole };
            } else {
                console.error("Unexpected response structure:", response.data);
                throw new Error('Invalid response structure from server');
            }
        } catch (error: any) {
            console.error("Login Error Details:", {
                message: error.message,
                name: error.name,
                response: error.response ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                } : 'No response',
                request: error.request ? 'Request made but no response received' : 'No request'
            });
            
            return rejectWithValue(error.response?.data?.message || error.message || "Login failed");
        }
    }
);

// Define the login slice
export const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        logout(state) {
            console.log("Logging out...");
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            localStorage.removeItem("userRole");
            state.token = null;
            state.userId = null;
            state.userRole = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                console.log("Login pending...");
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("Login fulfilled with payload:", action.payload);
                state.loading = false;
                state.token = action.payload.token;
                state.userId = action.payload.userId;
                state.userRole = action.payload.userRole;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log("Login rejected with payload:", action.payload);
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// Export the logout action
export const { logout } = loginSlice.actions;
// Export the auth reducer
export default loginSlice.reducer;