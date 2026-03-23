import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

//auth routes
import AdminLayout from '../components/layout/AdminLayout';
import ForgetPasswordPage from '../pages/auth/ForgetPasswordPage';
import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyPasswordPage from '../pages/auth/VerifyPasswordPage';

//other routes
import DashboardPage from '../pages/dashboard/DashboardPage';
import DriverDetailsPage from '../pages/driver/driver-details/DriverDetailsPage';
import DriverPage from '../pages/driver/DriverPage';
import RiderDetailsPage from '../pages/rider/rider-details/RiderDetailsPage';
import RiderPage from '../pages/rider/RiderPage';
import TripHistoryPage from '../pages/trips/TripHistoryPage';
import ApplicationDetailsPage from '../pages/verification/ApplicationDetailsPage';
import VerificationPage from '../pages/verification/VerificationPage';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/dashboard" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Other Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rider" element={<RiderPage />} />
          <Route path="/rider/details/:id" element={<RiderDetailsPage />} />
          <Route path="/driver" element={<DriverPage />} />
          <Route path="/driver/details/:id" element={<DriverDetailsPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/verification/details/:id" element={<ApplicationDetailsPage />} />
          <Route path="/trips" element={<TripHistoryPage />} />
        </Route>

        {/* Optional 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
