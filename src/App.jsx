import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from '@/components/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// Auth Pages
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

// Listener Pages
import Discover from '@/pages/Discover';
import LiveRoom from '@/pages/LiveRoom';
import Wallet from '@/pages/Wallet';
import UserProfile from '@/pages/UserProfile';

// Host Pages
import HostDashboard from '@/pages/HostDashboard';
import GoLive from '@/pages/GoLive';
import HostEarnings from '@/pages/HostEarnings';

// Agency Pages
import AgencyDashboard from '@/pages/AgencyDashboard';

// Admin Pages
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminWithdrawals from '@/pages/admin/AdminWithdrawals';
import AdminReports from '@/pages/admin/AdminReports';
import AdminGifts from '@/pages/admin/AdminGifts';
import AdminAgencies from '@/pages/admin/AdminAgencies';

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

      {/* Protected App Routes — all wrapped in AppLayout */}
      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          {/* Listener / Home */}
          <Route path="/" element={<Discover />} />
          <Route path="/rooms" element={<Discover />} />
          <Route path="/rooms/:id" element={<LiveRoom />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<UserProfile />} />

          {/* Host */}
          <Route path="/host" element={<HostDashboard />} />
          <Route path="/host/go-live" element={<GoLive />} />
          <Route path="/host/earnings" element={<HostEarnings />} />
          <Route path="/host/streams" element={<HostDashboard />} />
          <Route path="/host/followers" element={<HostDashboard />} />
          <Route path="/host/profile" element={<UserProfile />} />

          {/* Agency */}
          <Route path="/agency" element={<AgencyDashboard />} />
          <Route path="/agency/hosts" element={<AgencyDashboard />} />
          <Route path="/agency/earnings" element={<AgencyDashboard />} />
          <Route path="/agency/reports" element={<AgencyDashboard />} />
          <Route path="/agency/profile" element={<AgencyDashboard />} />

          {/* Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/rooms" element={<Discover />} />
          <Route path="/admin/gifts" element={<AdminGifts />} />
          <Route path="/admin/withdrawals" element={<AdminWithdrawals />} />
          <Route path="/admin/agencies" element={<AdminAgencies />} />
          <Route path="/admin/reports" element={<AdminReports />} />
          <Route path="/admin/levels" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />

          {/* VIP */}
          <Route path="/vip" element={<Wallet />} />
        </Route>
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
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;