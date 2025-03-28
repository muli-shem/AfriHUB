import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
            <Route path="/admindashboard" element={<AdminDashboard />} />
            <Route path="/admin/*" element={<AdminRoutes />} />
            <Route path="/content" element={<EducationalContentForm />} />
            <Route path="/createproject" element={<ProjectForm/>} />
            <Route path="/projects" element={<ProjectList/>} />
            <Route path="/profile" element={<UserProfile/>} />
         
          </Routes>
    </Router>
  );
};

export default App;
