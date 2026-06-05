import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

import { useAuth } from '@/context/useAuth';
import { usePermissions } from '@/hooks/usePermissions';
import { routes } from '@/routes/routes';
import type { OperatorModuleKey } from '@/types/operator.types';

import AdminLayout from '../components/layout/AdminLayout';
import ForgetPasswordPage from '../pages/auth/ForgetPasswordPage';
import LoginPage from '../pages/auth/LoginPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import VerifyPasswordPage from '../pages/auth/VerifyPasswordPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import DriverDetailsPage from '../pages/driver/driver-details/DriverDetailsPage';
import DriverPage from '../pages/driver/DriverPage';
import MyProfilePage from '../pages/MyProfilePage';
import RiderDetailsPage from '../pages/rider/rider-details/RiderDetailsPage';
import RiderPage from '../pages/rider/RiderPage';
import OperatorsPage from '../pages/settings/OperatorsPage';
import PricingLogicPage from '../pages/settings/PricingLogicPage';
import PushNotificationsPage from '../pages/settings/PushNotificationsPage';
import SupportTicketsPage from '../pages/support/SupportTicketsPage';
import TransactionsPage from '../pages/transactions/TransactionsPage';
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

function ModuleRoute({ moduleKey }: { moduleKey: OperatorModuleKey }) {
  const { canViewModule } = usePermissions();
  return canViewModule(moduleKey) ? <Outlet /> : <Navigate to={routes.MY_PROFILE} replace />;
}

function SettingsRouteRedirect() {
  const { canViewModule } = usePermissions();

  if (canViewModule('pricing')) return <Navigate to={routes.PRICING_LOGIC} replace />;
  if (canViewModule('notifications')) return <Navigate to={routes.PUSH_NOTIFICATIONS} replace />;
  if (canViewModule('operators')) return <Navigate to={routes.OPERATORS} replace />;
  return <Navigate to={routes.MY_PROFILE} replace />;
}

export default function AppRoutes() {
  return (
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
          <Route element={<ModuleRoute moduleKey="dashboard" />}>
            <Route path={routes.DASHBOARD} element={<DashboardPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="riders" />}>
            <Route path={routes.RIDER} element={<RiderPage />} />
            <Route path={routes.RIDER_DETAILS} element={<RiderDetailsPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="drivers" />}>
            <Route path={routes.DRIVER} element={<DriverPage />} />
            <Route path={routes.DRIVER_DETAILS} element={<DriverDetailsPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="verification" />}>
            <Route path={routes.VERIFICATION} element={<VerificationPage />} />
            <Route path={routes.VERIFICATION_DETAILS} element={<ApplicationDetailsPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="trips" />}>
            <Route path={routes.TRIPS} element={<TripHistoryPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="inventory" />}>
            <Route path={routes.INVENTORY} element={<VehicleInventoryPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="transactions" />}>
            <Route path={routes.TRANSACTIONS} element={<TransactionsPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="support" />}>
            <Route path={routes.SUPPORT} element={<SupportTicketsPage />} />
          </Route>
          <Route path={routes.SETTINGS} element={<SettingsRouteRedirect />} />
          <Route element={<ModuleRoute moduleKey="pricing" />}>
            <Route path={routes.PRICING_LOGIC} element={<PricingLogicPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="notifications" />}>
            <Route path={routes.PUSH_NOTIFICATIONS} element={<PushNotificationsPage />} />
          </Route>
          <Route element={<ModuleRoute moduleKey="operators" />}>
            <Route path={routes.OPERATORS} element={<OperatorsPage />} />
          </Route>
          <Route path={routes.MY_PROFILE} element={<MyProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<div>Page Not Found</div>} />
    </Routes>
  );
}
