import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Features/registerSlice"; // Import your authSlice
import loginReducer  from "../Features/loginSlice"; // Import your postsSlice
import educationReducer from "../Pages/Education/contentSlice";
import projectReducer from "../Pages/Projects/projectSlice";
import userProfileReducer from "../Pages/Profile/profileSlice"
import adminCommentsReducer from "../Pages/AdminDashboard/comments/adminCommentSlice";
import adminFeedbackReducer from "../Pages/AdminDashboard/feedback/adminFeedbackSlice";
import adminUsersReducer from "../Pages/AdminDashboard/user/userSlice";
import adminEducationReducer from "../Pages/AdminDashboard/Education/adminEducationSlice";
import adminProjectsReducer from "../Pages/AdminDashboard/Projects/adminProjectSlice";
// Define the root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  login: loginReducer,// Add more slices here as needed
  education: educationReducer,
  projects: projectReducer,
  userProfile: userProfileReducer,
  adminComments: adminCommentsReducer,
  adminFeedback: adminFeedbackReducer,
  adminUsers: adminUsersReducer,
  adminEducation: adminEducationReducer,
  adminProjects: adminProjectsReducer,
});

// Export the root reducer
export default rootReducer;

// Define the RootState type
export type RootState = ReturnType<typeof rootReducer>;