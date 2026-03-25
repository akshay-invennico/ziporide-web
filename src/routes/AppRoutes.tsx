import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/AuthContext';
import { routes } from '@/routes/routes';

import AdminLayout from '../components/layout/AdminLayout';
import ForgetPasswordPage from '../pages/auth/ForgetPasswordPage';
import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyPasswordPage from '../pages/auth/VerifyPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import DriverDetailsPage from '../pages/driver/driver-details/DriverDetailsPage';
import DriverPage from '../pages/driver/DriverPage';
import RiderDetailsPage from '../pages/rider/rider-details/RiderDetailsPage';
import RiderPage from '../pages/rider/RiderPage';
import TripHistoryPage from '../pages/trips/TripHistoryPage';
import VehicleInventoryPage from '../pages/vehicle-inventory/VehicleInventoryPage';
import ApplicationDetailsPage from '../pages/verification/ApplicationDetailsPage';
import VerificationPage from '../pages/verification/VerificationPage';

function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to={routes.LOGIN} replace />;
}

function GuestRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to={routes.DASHBOARD} replace /> : <Outlet />;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={routes.DASHBOARD} />} />

        <Route element={<GuestRoute />}>
          <Route path={routes.LOGIN} element={<LoginPage />} />
          <Route path={routes.FORGOT_PASSWORD} element={<ForgetPasswordPage />} />
          <Route path={routes.VERIFY_OTP} element={<VerifyPasswordPage />} />
          <Route path={routes.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path={routes.DASHBOARD} element={<DashboardPage />} />
            <Route path={routes.RIDER} element={<RiderPage />} />
            <Route path={routes.RIDER_DETAILS} element={<RiderDetailsPage />} />
            <Route path={routes.DRIVER} element={<DriverPage />} />
            <Route path={routes.DRIVER_DETAILS} element={<DriverDetailsPage />} />
            <Route path={routes.VERIFICATION} element={<VerificationPage />} />
            <Route path={routes.VERIFICATION_DETAILS} element={<ApplicationDetailsPage />} />
            <Route path={routes.TRIPS} element={<TripHistoryPage />} />
            <Route path={routes.INVENTORY} element={<VehicleInventoryPage />} />
          </Route>
        </Route>

        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}
