import { useFormik } from 'formik';
import { X } from 'lucide-react';
import React, { useEffect, useMemo } from 'react';
import * as Yup from 'yup';

import { usePermissionConfig } from '@/hooks/useOperatorData';
import type {
  Operator,
  CreateOperatorPayload,
  UpdateOperatorPayload,
} from '@/types/operator.types';

import Dropdown from './Dropdown';

interface OperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: Operator | null;
  onConfirm?: (values: CreateOperatorPayload | UpdateOperatorPayload) => void;
  isSubmitting?: boolean;
}

const PERMISSION_CATEGORIES = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    permissions: [
      { id: 'dashboard.view_analytics', label: 'View Dashboard Analytics' },
      { id: 'dashboard.view_revenue', label: 'View Revenue Insights' },
    ],
  },
  {
    id: 'riders',
    label: 'Riders',
    permissions: [
      { id: 'riders.view', label: 'View Riders' },
      { id: 'riders.view_details', label: 'View Rider Details' },
      { id: 'riders.suspend', label: 'Suspend / Reactivate Rider' },
    ],
  },
  {
    id: 'drivers',
    label: 'Drivers',
    permissions: [
      { id: 'drivers.view', label: 'View Drivers' },
      { id: 'drivers.view_details', label: 'View Driver Details' },
      { id: 'drivers.approve_reject', label: 'Approve / Reject Drivers' },
      { id: 'drivers.suspend', label: 'Suspend / Activate Driver' },
    ],
  },
  {
    id: 'verification',
    label: 'Verification Requests',
    permissions: [
      { id: 'verification.view', label: 'View Verification Requests' },
      { id: 'verification.review_documents', label: 'Review Documents' },
      { id: 'verification.approve_reject', label: 'Approve / Reject' },
    ],
  },
  {
    id: 'trips',
    label: 'Trips',
    permissions: [
      { id: 'trips.view', label: 'View All Trips' },
      { id: 'trips.view_details', label: 'View Trip Details' },
      { id: 'trips.cancel_ride', label: 'Cancel Ride (Pre-start)' },
      { id: 'trips.force_end_ride', label: 'Force End Ride' },
    ],
  },
  {
    id: 'inventory',
    label: 'Vehicle Inventory',
    permissions: [
      { id: 'inventory.view', label: 'View Categories' },
      { id: 'inventory.create', label: 'Create Category' },
      { id: 'inventory.edit', label: 'Edit Category' },
      { id: 'inventory.delete', label: 'Delete Category' },
    ],
  },
  {
    id: 'support',
    label: 'Support Tickets',
    permissions: [
      { id: 'support.view', label: 'View Tickets' },
      { id: 'support.respond', label: 'Respond to Tickets' },
      { id: 'support.close', label: 'Close Tickets' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Settings',
    permissions: [
      { id: 'pricing.view', label: 'View Pricing' },
      { id: 'pricing.edit', label: 'Edit Pricing Logic' },
    ],
  },
  {
    id: 'notifications',
    label: 'Push Notifications',
    permissions: [{ id: 'notifications.send', label: 'Send Notifications' }],
  },
  {
    id: 'operators',
    label: 'Operators Management',
    permissions: [
      { id: 'operators.view', label: 'View Operators' },
      { id: 'operators.manage', label: 'Add / Edit / Operator' },
      { id: 'operators.remove', label: 'Remove Operator' },
    ],
  },
];

const PERMISSION_LABELS: Record<string, string> = {
  'dashboard.view_analytics': 'View Dashboard Analytics',
  'dashboard.view_revenue': 'View Revenue Insights',
  'riders.view': 'View Riders',
  'riders.view_details': 'View Rider Details',
  'riders.suspend': 'Suspend / Reactivate Rider',
  'drivers.view': 'View Drivers',
  'drivers.view_details': 'View Driver Details',
  'drivers.approve_reject': 'Approve / Reject Drivers',
  'drivers.suspend': 'Suspend / Activate Driver',
  'verification.view': 'View Verification Requests',
  'verification.review_documents': 'Review Documents',
  'verification.approve_reject': 'Approve / Reject',
  'trips.view': 'View All Trips',
  'trips.view_details': 'View Trip Details',
  'trips.cancel_ride': 'Cancel Ride (Pre-start)',
  'trips.force_end_ride': 'Force End Ride',
  'inventory.view': 'View Categories',
  'inventory.create': 'Create Category',
  'inventory.edit': 'Edit Category',
  'inventory.delete': 'Delete Category',
  'support.view': 'View Tickets',
  'support.respond': 'Respond to Tickets',
  'support.close': 'Close Tickets',
  'pricing.view': 'View Pricing',
  'pricing.edit': 'Edit Pricing Logic',
  'notifications.send': 'Send Notifications',
  'operators.view': 'View Operators',
  'operators.manage': 'Add / Edit / Operator',
  'operators.remove': 'Remove Operator',
};

const OperatorModal: React.FC<OperatorModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onConfirm,
  isSubmitting = false,
}) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';
  const { config } = usePermissionConfig();

  const permissionCategories = config
    ? Object.entries(config.modules).map(([key, mod]) => ({
        id: key,
        label: mod.label,
        permissions: mod.permissions.map((p) => ({
          id: p,
          label: PERMISSION_LABELS[p] || p,
        })),
      }))
    : PERMISSION_CATEGORIES;

  const roleDefaults = useMemo(() => config?.roleDefaults || {}, [config?.roleDefaults]);

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: isEdit
      ? Yup.string().min(8, 'Password must be at least 8 characters')
      : isView
        ? Yup.string()
        : Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    role: Yup.string().required('Role is required'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || '',
      permissions: initialData?.permissions || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (!onConfirm) return;

      if (mode === 'add') {
        const payload: CreateOperatorPayload = {
          name: values.fullName,
          email: values.email,
          password: values.password,
          role: values.role as 'admin' | 'manager' | 'operator',
          permissions: values.permissions,
        };
        onConfirm(payload);
      } else if (mode === 'edit') {
        const payload: UpdateOperatorPayload = {
          name: values.fullName,
          email: values.email,
          role: values.role as 'admin' | 'manager' | 'operator',
          permissions: values.permissions,
        };
        if (values.password) {
          payload.password = values.password;
        }
        onConfirm(payload);
      }
    },
  });

  useEffect(() => {
    if (isView || !formik.values.role) return;
    const defaults = roleDefaults[formik.values.role.toLowerCase()];
    if (defaults && mode === 'add') {
      formik.setFieldValue('permissions', [...defaults]);
    }
  }, [formik, isView, roleDefaults, mode]);

  const togglePermission = (permId: string) => {
    if (isView) return;
    const currentPerms = [...formik.values.permissions];
    if (currentPerms.includes(permId)) {
      formik.setFieldValue(
        'permissions',
        currentPerms.filter((id) => id !== permId),
      );
    } else {
      formik.setFieldValue('permissions', [...currentPerms, permId]);
    }
  };

  const toggleCategory = (catId: string) => {
    if (isView) return;
    const category = permissionCategories.find((c) => c.id === catId);
    if (!category) return;

    const catPermIds = category.permissions.map((p) => p.id);
    const currentPerms = [...formik.values.permissions];
    const allSelected = catPermIds.every((id) => currentPerms.includes(id));

    if (allSelected) {
      formik.setFieldValue(
        'permissions',
        currentPerms.filter((id) => !catPermIds.includes(id)),
      );
    } else {
      const newPerms = Array.from(new Set([...currentPerms, ...catPermIds]));
      formik.setFieldValue('permissions', newPerms);
    }
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (isView) return 'Operator Details';
    if (isEdit) return 'Edit Operator';
    return 'Add New Operator';
  };

  const getSubtitle = () => {
    if (isView) return 'Operator details & Permissions';
    if (isEdit) return 'Update operator details, role, and permissions.';
    return 'Create a new operator account';
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'operator':
        return 'Operator';
      default:
        return role;
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-end bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] w-[800px] max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DFE6E5] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-[48px] h-[48px] bg-[#EEFFFD] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/icons/settings/operator.svg"
                alt="operator"
                className="w-[32px] h-[32px] object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-semibold text-[#000000] font-inter">{getTitle()}</h2>
              <p className="text-[14px] font-medium text-[#4E616A] font-inter">{getSubtitle()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 cursor-pointer text-[#4E616A]  rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-[16px] font-semibold text-[#000000] mb-6">Basic Information</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                    Full Name
                  </label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">
                      {formik.values.fullName}
                    </p>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="e.g. John Doe"
                        value={formik.values.fullName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                      />
                      {formik.touched.fullName && formik.errors.fullName && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.fullName}</p>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">Email</label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">
                      {formik.values.email}
                    </p>
                  ) : (
                    <>
                      <input
                        type="email"
                        name="email"
                        placeholder="e.g. example@email.com"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium  hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                      )}
                    </>
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                    Password
                  </label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">********</p>
                  ) : (
                    <>
                      <input
                        type="password"
                        name="password"
                        placeholder={isEdit ? 'Leave blank to keep current' : '********'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium  hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                      />
                      {formik.touched.password && formik.errors.password && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                      )}
                    </>
                  )}
                </div>
                <div>
                  {isView ? (
                    <>
                      <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                        Role
                      </label>
                      <p className="text-[14px] font-semibold text-[#000000]">
                        {getRoleDisplayName(formik.values.role)}
                      </p>
                    </>
                  ) : (
                    <Dropdown
                      label="Role"
                      name="role"
                      placeholder="Select Role"
                      value={formik.values.role}
                      onChange={(val) => formik.setFieldValue('role', val)}
                      options={[
                        { label: 'Admin', value: 'admin' },
                        { label: 'Manager', value: 'manager' },
                        { label: 'Operator', value: 'operator' },
                      ]}
                      error={
                        formik.touched.role && formik.errors.role ? formik.errors.role : undefined
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <h3 className="text-[16px] font-semibold text-[#000000] mb-6">Permissions</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {permissionCategories.map((category) => {
                  const catPermIds = category.permissions.map((p) => p.id);
                  const isCatSelected = catPermIds.every((id) =>
                    formik.values.permissions.includes(id),
                  );
                  const isCatPartial =
                    catPermIds.some((id) => formik.values.permissions.includes(id)) &&
                    !isCatSelected;

                  return (
                    <div
                      key={category.id}
                      className="border w-[240px] min-h-[182px] border-[#DFE6E5] rounded-lg p-4 space-y-4"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          onClick={() => toggleCategory(category.id)}
                          className={`w-5 h-5 rounded border ${isCatSelected ? 'bg-[#1DAFA1] border-[#1DAFA1]' : 'border-[#DFE6E5]'} flex items-center justify-center cursor-pointer transition-colors`}
                        >
                          {isCatSelected && (
                            <svg
                              className="w-3.5 h-3.5 text-white"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                          {isCatPartial && <div className="w-2.5 h-0.5 bg-[#1DAFA1]" />}
                        </div>
                        <span className="text-[14px] font-semibold text-[#000000]">
                          {category.label}
                        </span>
                      </div>
                      <div className="space-y-4">
                        {category.permissions.map((permission) => {
                          const isSelected = formik.values.permissions.includes(permission.id);
                          return (
                            <div key={permission.id} className="flex items-center gap-3">
                              <div
                                onClick={() => togglePermission(permission.id)}
                                className={`w-5 h-5 rounded border ${isSelected ? 'bg-[#1DAFA1] border-[#1DAFA1]' : 'border-[#DFE6E5]'} flex items-center justify-center cursor-pointer transition-colors`}
                              >
                                {isSelected && (
                                  <svg
                                    className="w-3.5 h-3.5 text-white"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[14px] font-medium text-[#4E616A]">
                                {permission.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        {!isView && (
          <div className="px-6 py-5 border-t border-[#DFE6E5] flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-[#000000] bg-white  cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-white bg-[#1DAFA1]  cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEdit
                  ? 'Updating...'
                  : 'Creating...'
                : isEdit
                  ? 'Update Operator'
                  : 'Add Operator'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorModal;
