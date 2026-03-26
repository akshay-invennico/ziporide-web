import { useFormik } from 'formik';
import { X, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import * as Yup from 'yup';

import type { UpdatePasswordPayload } from '@/types/user.types';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (values: UpdatePasswordPayload) => void;
  isLoading?: boolean;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  isLoading,
}) => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = Yup.object({
    currentPassword: Yup.string().required('Current password is required'),
    newPassword: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('New password is required')
      .notOneOf(
        [Yup.ref('currentPassword')],
        'New password cannot be the same as current password',
      ),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword')], 'New and confirm passwords are not matching')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: (values) => {
      onUpdate({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-lg border border-[#DFE6E5] w-[648px] h-[520px] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#DFE6E5] flex items-start gap-4">
          <div className="w-[52px] h-[52px] bg-[#F9F9F9] rounded-full flex items-center justify-center shrink-0">
            <img src="/icons/changePassword.svg" alt="lock" className="w-[26px] h-[26px]" />
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] font-semibold text-[#000000] font-inter">Change Password</h2>
            <p className="text-[12px] font-medium text-[#534D4B] font-inter mt-1 leading-snug">
              Change your password to keep your account secure. Make sure it's strong and unique.
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-[#4E616A] cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={formik.handleSubmit} className="p-6 space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">
              Current Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <img src="/icons/lockPassword.svg" alt="lock" className="w-[18px] h-[18px]" />
              </div>
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                className={`w-full pl-10 pr-10 py-3 border rounded-md text-[14px] font-medium focus:outline-none transition-colors hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] ${
                  formik.touched.currentPassword && formik.errors.currentPassword
                    ? 'border-red-500'
                    : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                }`}
                placeholder="••••••••"
                value={formik.values.currentPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000] cursor-pointer"
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.currentPassword && formik.errors.currentPassword && (
              <p className="text-red-500 text-[12px] mt-1">{formik.errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">
              New Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <img src="/icons/lockPassword.svg" alt="lock" className="w-[18px] h-[18px]" />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                name="newPassword"
                className={`w-full pl-10 pr-10 py-3 border rounded-md text-[14px] font-medium focus:outline-none transition-colors hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? 'border-red-500'
                    : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                }`}
                placeholder="••••••••"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000] cursor-pointer"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.newPassword && formik.errors.newPassword && (
              <p className="text-red-500 text-[12px] mt-1">{formik.errors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-[14px] font-medium text-[#000000] mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <img src="/icons/lockPassword.svg" alt="lock" className="w-[18px] h-[18px]" />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className={`w-full pl-10 pr-10 py-3 border rounded-md text-[14px] font-medium focus:outline-none transition-colors hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] ${
                  formik.touched.confirmPassword && formik.errors.confirmPassword
                    ? 'border-red-500'
                    : 'border-[#DFE6E5] focus:border-[#1DAFA1]'
                }`}
                placeholder="••••••••"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#000000] cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <p className="text-red-500 text-[12px] mt-1">{formik.errors.confirmPassword}</p>
            )}
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 py-3 bg-[#F7F7F7] text-[#000000] text-[14px] font-medium rounded-md cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 bg-[#1DAFA1] text-white text-[14px] font-medium rounded-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
