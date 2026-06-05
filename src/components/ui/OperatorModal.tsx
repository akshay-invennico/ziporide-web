import { useFormik } from 'formik';
import { X } from 'lucide-react';
import React, { useMemo } from 'react';
import * as Yup from 'yup';

import { usePermissionConfig } from '@/hooks/useOperatorData';
import type {
  CreateOperatorPayload,
  ModuleAccess,
  ModuleAccessLevel,
  Operator,
  OperatorModuleKey,
  OperatorRole,
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

const DEFAULT_MODULES: Array<{
  key: OperatorModuleKey;
  label: string;
  accessLevels: ModuleAccessLevel[];
  defaultAccess: ModuleAccessLevel;
}> = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  { key: 'riders', label: 'Riders', accessLevels: ['view', 'edit', 'hide'], defaultAccess: 'view' },
  {
    key: 'drivers',
    label: 'Drivers',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'verification',
    label: 'Verification Requests',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  { key: 'trips', label: 'Trips', accessLevels: ['view', 'edit', 'hide'], defaultAccess: 'view' },
  {
    key: 'inventory',
    label: 'Vehicle Inventory',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'transactions',
    label: 'Transactions',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'support',
    label: 'Support Tickets',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'pricing',
    label: 'Pricing & Settings',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'notifications',
    label: 'Push Notifications',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
  {
    key: 'operators',
    label: 'Operators Management',
    accessLevels: ['view', 'edit', 'hide'],
    defaultAccess: 'view',
  },
];

const ACCESS_OPTIONS: Array<{ label: string; value: ModuleAccessLevel; description: string }> = [
  { label: 'View', value: 'view', description: 'Can open and inspect this module.' },
  { label: 'Edit', value: 'edit', description: 'Includes View and allows changes.' },
  { label: 'Hide', value: 'hide', description: 'Module is hidden and disabled.' },
];

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Operator', value: 'operator' },
];

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Suspended', value: 'suspended' },
];

const buildDefaultModuleAccess = (
  modules: typeof DEFAULT_MODULES,
  overrides?: Partial<ModuleAccess>,
): ModuleAccess =>
  modules.reduce((acc, mod) => {
    acc[mod.key] = overrides?.[mod.key] || mod.defaultAccess || 'view';
    return acc;
  }, {} as ModuleAccess);

const mergePermissionModules = (modules?: typeof DEFAULT_MODULES): typeof DEFAULT_MODULES => {
  if (!modules?.length) return DEFAULT_MODULES;

  const moduleByKey = new Map(DEFAULT_MODULES.map((mod) => [mod.key, mod]));

  modules.forEach((mod) => {
    moduleByKey.set(mod.key, {
      ...mod,
      accessLevels: ['view', 'edit', 'hide'],
      defaultAccess: mod.defaultAccess || 'view',
    });
  });

  return [
    ...DEFAULT_MODULES.map((mod) => moduleByKey.get(mod.key) || mod),
    ...modules.filter((mod) => !DEFAULT_MODULES.some((defaultMod) => defaultMod.key === mod.key)),
  ];
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
      return role || '-';
  }
};

const getStatusDisplayName = (status: string) => {
  switch (status) {
    case 'active':
      return 'Active';
    case 'inactive':
      return 'Inactive';
    case 'suspended':
      return 'Suspended';
    default:
      return status || '-';
  }
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

  const modules = useMemo(
    () =>
      mergePermissionModules(config?.modules).map((mod) => ({
        ...mod,
        accessLevels: ['view', 'edit', 'hide'] as ModuleAccessLevel[],
        defaultAccess: mod.defaultAccess || 'view',
      })),
    [config?.modules],
  );

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Full name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password:
      isEdit || isView
        ? Yup.string()
        : Yup.string()
            .min(8, 'Password must be at least 8 characters')
            .required('Password is required'),
    role: Yup.string().required('Role is required'),
    status: Yup.string().required('Status is required'),
  });

  const initialModuleAccess = useMemo(
    () => buildDefaultModuleAccess(modules, initialData?.moduleAccess),
    [modules, initialData?.moduleAccess],
  );

  const formik = useFormik({
    initialValues: {
      fullName: initialData?.name || '',
      email: initialData?.email || '',
      password: '',
      role: initialData?.role || '',
      status: initialData?.status || 'active',
      moduleAccess: initialModuleAccess,
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
          role: values.role as OperatorRole,
          status: values.status as Operator['status'],
          moduleAccess: values.moduleAccess,
        };
        onConfirm(payload);
      } else if (mode === 'edit') {
        const payload: UpdateOperatorPayload = {
          name: values.fullName,
          email: values.email,
          role: values.role as OperatorRole,
          status: values.status as Operator['status'],
          moduleAccess: values.moduleAccess,
        };
        onConfirm(payload);
      }
    },
  });

  const applyRoleDefaults = (role: string) => {
    const roleDefaults = config?.roleDefaults?.[role as OperatorRole];
    formik.setFieldValue('role', role);
    formik.setFieldValue('moduleAccess', buildDefaultModuleAccess(modules, roleDefaults));
  };

  const setModuleAccess = (moduleKey: OperatorModuleKey, access: ModuleAccessLevel) => {
    if (isView) return;
    formik.setFieldValue('moduleAccess', {
      ...formik.values.moduleAccess,
      [moduleKey]: access,
    });
  };

  if (!isOpen) return null;

  const getTitle = () => {
    if (isView) return 'Operator Details';
    if (isEdit) return 'Edit Operator';
    return 'Add New Operator';
  };

  const getSubtitle = () => {
    if (isView) return 'Operator details & module access';
    if (isEdit) return 'Update operator details, role, and module access.';
    return 'Create a new operator account';
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-end bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5] w-[860px] max-h-[92vh] flex flex-col overflow-hidden">
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
            className="p-1 cursor-pointer text-[#4E616A] rounded-full transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
          <div className="space-y-8">
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
                        className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                      />
                      {formik.touched.email && formik.errors.email && (
                        <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
                      )}
                    </>
                  )}
                </div>

                {!isEdit && (
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
                          placeholder="********"
                          value={formik.values.password}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                        />
                        {formik.touched.password && formik.errors.password && (
                          <p className="mt-1 text-xs text-red-500">{formik.errors.password}</p>
                        )}
                      </>
                    )}
                  </div>
                )}

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
                      onChange={applyRoleDefaults}
                      options={ROLE_OPTIONS}
                      error={
                        formik.touched.role && formik.errors.role ? formik.errors.role : undefined
                      }
                    />
                  )}
                </div>

                <div>
                  {isView ? (
                    <>
                      <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                        Status
                      </label>
                      <p className="text-[14px] font-semibold text-[#000000]">
                        {getStatusDisplayName(formik.values.status)}
                      </p>
                    </>
                  ) : (
                    <Dropdown
                      label="Status"
                      name="status"
                      placeholder="Select Status"
                      value={formik.values.status}
                      onChange={(value) => formik.setFieldValue('status', value)}
                      options={STATUS_OPTIONS}
                      error={
                        formik.touched.status && formik.errors.status
                          ? formik.errors.status
                          : undefined
                      }
                    />
                  )}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-[16px] font-semibold text-[#000000] mb-6">Module Access</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module) => {
                  const selectedAccess = formik.values.moduleAccess[module.key] || 'view';

                  return (
                    <div
                      key={module.key}
                      className="border border-[#DFE6E5] rounded-lg p-4 flex flex-col gap-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[14px] font-semibold text-[#000000]">
                          {module.label}
                        </span>
                        {selectedAccess === 'edit' && (
                          <span className="text-[11px] font-semibold text-[#1DAFA1] bg-[#EEFFFD] px-2 py-1 rounded-sm">
                            View included
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {ACCESS_OPTIONS.map((option) => {
                          const isSelected = selectedAccess === option.value;
                          return (
                            <button
                              key={`${module.key}-${option.value}`}
                              type="button"
                              disabled={isView}
                              onClick={() => setModuleAccess(module.key, option.value)}
                              title={option.description}
                              className={`px-3 py-2 rounded-sm border text-[13px] font-semibold transition-colors ${
                                isSelected
                                  ? option.value === 'hide'
                                    ? 'border-[#FF0707] text-[#FF0707] bg-[#FFF6F6]'
                                    : 'border-[#1DAFA1] text-[#1DAFA1] bg-[#EEFFFD]'
                                  : 'border-[#DFE6E5] text-[#4E616A] bg-white'
                              } ${isView ? 'cursor-default opacity-80' : 'cursor-pointer'}`}
                            >
                              {option.label}
                            </button>
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

        {!isView && (
          <div className="px-6 py-5 border-t border-[#DFE6E5] flex justify-end gap-4 shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-[#000000] bg-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-white bg-[#1DAFA1] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
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
