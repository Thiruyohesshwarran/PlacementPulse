import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import DashboardOverview from './pages/Dashboard/DashboardOverview';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import DashboardLayout from './components/layout/DashboardLayout';

import DSATracker from './pages/DSA/DSATracker';
import MockInterviews from './pages/Interviews/MockInterviews';
import CompanyPrep from './pages/CompanyPrep/CompanyPrep';
import Insights from './pages/Insights/Insights';
import CommunityFeed from './pages/Community/CommunityFeed';
import Settings from './pages/Profile/Settings';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes nested in DashboardLayout */}
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardOverview />} />
            <Route path="dsa" element={<DSATracker />} />
            <Route path="interviews" element={<MockInterviews />} />
            <Route path="companies" element={<CompanyPrep />} />
            <Route path="insights" element={<Insights />} />
            <Route path="community" element={<CommunityFeed />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
