import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
// import DashboardOverview from './pages/DashboardOverview';
// import UserManagement from './pages/UserManagement';
// import Analytics from './pages/Analytics';
// import ContentManagement from './pages/ContentManagement';
// import AccessControl from './pages/AccessControl';
// import Settings from './pages/Settings';
// import DashboardReports from './pages/DashboardReports';
// import DashboardPerformance from './pages/DashboardPerformance';
// import DashboardInsights from './pages/DashboardInsights';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin" element={<AdminDashboard />}>
        {/* Nested routes that will render inside <Outlet /> */}
        {/* <Route index element={<DashboardOverview />} />
        <Route path="dashboard/overview" element={<DashboardOverview />} />
        <Route path="dashboard/reports" element={<DashboardReports />} />
        <Route path="dashboard/performance" element={<DashboardPerformance />} />
        <Route path="dashboard/insights" element={<DashboardInsights />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="content" element={<ContentManagement />} />
        <Route path="access" element={<AccessControl />} />
        <Route path="settings" element={<Settings />} /> */}
      </Route>
    </Routes>
  );
};

export default AdminRoutes;