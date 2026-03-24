import { useFormik } from 'formik';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import * as Yup from 'yup';

import { useAuthData } from '@/hooks/useAuthData';

const ResetPasswordPage = () => {
  const location = useLocation();
  const email = location.state?.email || '';
  const { resetPassword, isLoading } = useAuthData();

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
        .matches(/[0-9]/, 'Must contain at least one number')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords do not match')
        .required('Please confirm your password'),
    }),
    onSubmit: (values) => {
      resetPassword({ email, newPassword: values.newPassword });
    },
  });

  return (
    <div className="fixed inset-0 flex items-start sm:items-center justify-center bg-[#f0f0f0] overflow-y-auto p-4">
      <div className="bg-white shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] rounded-xl w-full max-w-[560px] max-h-[600px] overflow-auto px-5 sm:px-10 py-8 sm:py-10 my-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6">
          <img src="/logo.svg" alt="ZipoRide" className="w-[32px] h-[32px]" />
          <h3 className="font-semibold text-[24px] text-[#000000] font-inter">ZipoRide</h3>
        </div>

        {/* Heading */}
        <h1 className="text-[24px] font-bold text-[#000000] mb-1 font-inter">
          Reset Your Password
        </h1>
        <p className="text-[14px] font-medium text-[#4E616A] mb-6 font-inter">
          Create a new password to regain access
        </p>

        <form onSubmit={formik.handleSubmit} noValidate>
          {/* New Password */}
          <div className="mb-4">
            <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
              New Password
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 py-2 transition
              ${
                formik.touched.newPassword && formik.errors.newPassword
                  ? 'border-red-400 focus-within:border-red-500'
                  : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
              }`}
            >
              <img
                src={
                  formik.values.newPassword ? '/icons/auth/lockOn.svg' : '/icons/auth/lockOff.svg'
                }
                alt="password"
                className="w-5 h-5 mr-2 shrink-0"
              />
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                placeholder="••••••••••"
                {...formik.getFieldProps('newPassword')}
                className="flex-1 text-[14px] font-medium text-[#000000] outline-none placeholder-[#939999] bg-transparent"
              />
              <button type="button" onClick={() => setShowNew((p) => !p)} className="ml-2">
                <img
                  src={showNew ? '/icons/auth/eyeOpen.svg' : '/icons/auth/eyeClose.svg'}
                  alt="toggle visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-15">
            <label className="block text-[14px] font-medium text-[#4E616A] mb-2 font-inter">
              Confirm Password
            </label>
            <div
              className={`flex items-center border rounded-lg px-3 py-2 transition
              ${
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? 'border-red-400 focus-within:border-red-500'
                  : 'border-[#DFE6E5] focus-within:border-[#1DAFA1] hover:shadow-[0_0_16px_0_#ED9B0E3D]'
              }`}
            >
              <img
                src={
                  formik.values.confirmPassword
                    ? '/icons/auth/lockOn.svg'
                    : '/icons/auth/lockOff.svg'
                }
                alt="password"
                className="w-5 h-5 mr-2 shrink-0"
              />
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                placeholder="••••••••••"
                {...formik.getFieldProps('confirmPassword')}
                className="flex-1 text-[14px] font-medium text-[#000000] outline-none placeholder-[#939999] bg-transparent"
              />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="ml-2">
                <img
                  src={showConfirm ? '/icons/auth/eyeOpen.svg' : '/icons/auth/eyeClose.svg'}
                  alt="toggle visibility"
                  className="w-5 h-5"
                />
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Reset Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#1DAFA1] cursor-pointer text-white font-semibold text-[16px] py-2.5 rounded-lg transition disabled:opacity-60"
          >
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[12px] font-medium text-[#4E616A] mt-6">
          © 2026 Zipo Ride. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
