import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import FloatingNav from '@/components/navigation/FloatingNav';

// Auth Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// App Pages
import Home from '@/pages/Home';
import Me from '@/pages/Me';
import Inbox from '@/pages/Inbox';
import ChatRoom from '@/pages/ChatRoom';
import AudioCallScreen from '@/pages/AudioCallScreen';
import LiveRoomV2 from '@/pages/LiveRoomV2';
import GoLive from '@/pages/GoLive';
import Community from '@/pages/Community';
import TasksRewards from '@/pages/TasksRewards';
import Support from '@/pages/Support';
import Social from '@/pages/Social';
import ProfileStats from '@/pages/ProfileStats';
import Finance from '@/pages/Finance';
import Levels from '@/pages/Levels';
import UserLevelSystem from '@/pages/UserLevelSystem';
import Settings from '@/pages/Settings';
import MessagesCenter from '@/pages/MessagesCenter';
import AppCenter from '@/pages/AppCenter';
import ControlCenter from '@/pages/ControlCenter';
import AgentDashboard from '@/pages/AgentDashboard';
import HostDashboardPage from '@/pages/HostDashboardPage';
import AgencyDashboardPage from '@/pages/AgencyDashboardPage';
import CreatorCenter from '@/pages/CreatorCenter';
import OwnerDashboard from '@/pages/OwnerDashboard';
import CountryManagerDashboard from '@/pages/CountryManagerDashboard';
import BusinessDeveloperDashboard from '@/pages/BusinessDeveloperDashboard';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0D0D1A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-purple-300 text-sm">Loading VYRO LIVE...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') return <UserNotRegisteredError />;
    if (authError.type === 'auth_required') { navigateToLogin(); return null; }
  }

  return (
    <Routes>
      {/* Public Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route path="/" element={<Me />} />
        <Route path="/me" element={<Me />} />
        <Route path="/inbox" element={<Inbox />} />
        <Route path="/chat/:chatId" element={<ChatRoom />} />
        <Route path="/call" element={<AudioCallScreen />} />
        <Route path="/live-room" element={<LiveRoomV2 />} />
        <Route path="/go-live" element={<GoLive />} />
        <Route path="/community" element={<Community />} />
        <Route path="/tasks-rewards" element={<TasksRewards />} />
        <Route path="/support" element={<Support />} />
        <Route path="/social" element={<Social />} />
        <Route path="/profile-stats" element={<ProfileStats />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/user-level-system" element={<UserLevelSystem />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/messages-center" element={<MessagesCenter />} />
        <Route path="/app-center" element={<AppCenter />} />
        <Route path="/control-center" element={<ControlCenter />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/host-dashboard" element={<HostDashboardPage />} />
        <Route path="/agency-dashboard-page" element={<AgencyDashboardPage />} />
        <Route path="/creator-center" element={<CreatorCenter />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/country-manager-dashboard" element={<CountryManagerDashboard />} />
        <Route path="/business-developer-dashboard" element={<BusinessDeveloperDashboard />} />
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
          <FloatingNav />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;