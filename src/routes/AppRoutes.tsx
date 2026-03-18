import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

//auth routes
import LoginPage from "../pages/auth/LoginPage";
import ForgetPasswordPage from "../pages/auth/ForgetPasswordPage";
import VerifyPasswordPage from "../pages/auth/VerifyPasswordPage";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

//other routes
import DashboardPage from "../pages/DashboardPage";
import RiderPage from "../pages/RiderPage";
import DriverPage from "../pages/DriverPage";
import AdminLayout from "../components/layout/AdminLayout";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgetPasswordPage />} />
        <Route path="/verify-password" element={<VerifyPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Other Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/rider" element={<RiderPage />} />
          <Route path="driver" element={<DriverPage />} />
        </Route>


        {/* Optional 404 */}
        <Route path="*" element={<div>Page Not Found</div>} />

      </Routes>
    </BrowserRouter>
  );
}