import React from 'react';
import { Routes, Route} from 'react-router-dom';

// Dashboard sub-components
const DashboardOverview = () => <div>Dashboard Overview Content</div>;
const DashboardReports = () => <div>Dashboard Reports Content</div>;
const DashboardPerformance = () => <div>Dashboard Performance Content</div>;
const DashboardInsights = () => <div>Dashboard Insights Content</div>;

const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardOverview />} />
      <Route path="/reports" element={<DashboardReports />} />
      <Route path="/performance" element={<DashboardPerformance />} />
      <Route path="/insights" element={<DashboardInsights />} />
    </Routes>
  );
};

export default AdminDashboard;