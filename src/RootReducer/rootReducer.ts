import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Features/registerSlice"; // Import your authSlice
import loginReducer  from "../Features/loginSlice"; // Import your postsSlice
import educationReducer from "../Pages/Education/contentSlice";
import projectReducer from "../Pages/Projects/projectSlice";
import userProfileReducer from "../Pages/Profile/profileSlice"
import postsReducer from "../Pages/posts/postsSlice"


// Define the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  login: loginReducer,// Add more slices here as needed
  posts: postsReducer,
  education: educationReducer,
  projects: projectReducer,
  userProfile: userProfileReducer,
});

// Export the root reducer
export default rootReducer;

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;