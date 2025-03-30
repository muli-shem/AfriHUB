import React from "react";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import Home from "./Pages/HomePage";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import Register from "./Features/Register";
import Login from "./Features/Login";
import Dashboard from "./Pages/Dashboard/Dashboard";
import EducationalContentForm from "./Pages/Education/content";
import AdminDashboard from "./Pages/AdminDashboard/AdminDashboard";
import ProjectForm from "./Pages/Projects/ProjectForm";
import ProjectList from "./Pages/Projects/ProjectList";
import AdminRoutes from "./Pages/AdminDashboard/AdminRouters";
import UserProfile from "./Pages/Profile/userProfile";
import AdminComments from "./Pages/AdminDashboard/comments/adminComments";
import AdminFeedback from "./Pages/AdminDashboard/feedback/adminfeedback";
import AdminUsers from "./Pages/AdminDashboard/user/userList";
import AdminProjects from "./Pages/AdminDashboard/Projects/adminproject";
import AdminEducationContent from "./Pages/AdminDashboard/Education/adminEducation";
import AdminLayout from "./Pages/AdminDashboard/adminLayoutForm";

 

const App: React.FC = () => {
  return (
    <Router>
    
      
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminRoutes />} />
            <Route path="/content" element={<EducationalContentForm />} />
            <Route path="/createproject" element={<ProjectForm/>} />
            <Route path="/projects" element={<ProjectList/>} />
            <Route path="/profile" element={<UserProfile/>} />
  {/* Admin routes nested under the Admin Layout */}
  <Route path="/admin" element={<AdminLayout />}>
        {/* Dashboard as index */}
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Dashboard and its sub-routes */}
        <Route path="dashboard/*" element={<AdminDashboard />} />
        
        {/* Other admin sections */}
        <Route path="users" element={<AdminUsers />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="comments" element={<AdminComments />} />
        <Route path="feedbacks" element={<AdminFeedback />} />
        <Route path="education" element={<AdminEducationContent />} />
        
        
        {/* Catch-all for /admin/* */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
      
      {/* Redirect root to admin */}
      <Route path="/" element={<Navigate to="/admin" replace />} />
      
      {/* Redirect legacy paths if needed */}
      <Route path="/admindashboard" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/allusers" element={<Navigate to="/admin/users" replace />} />
      <Route path="/adminprojects" element={<Navigate to="/admin/projects" replace />} />
      <Route path="/comments" element={<Navigate to="/admin/comments" replace />} />
      <Route path="/feedbacks" element={<Navigate to="/admin/feedbacks" replace />} />
      <Route path="/admineducation" element={<Navigate to="/admin/education" replace />} />
      
      {/* Global catch-all */}
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
    </Router>
  );
};

export default App;
