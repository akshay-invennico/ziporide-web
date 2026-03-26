import { useFormik } from 'formik';
import { X, ChevronDown } from 'lucide-react';
import React from 'react';
import * as Yup from 'yup';

interface OperatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit' | 'view';
  initialData?: any;
  onConfirm?: (values: any) => void;
}

const permissionCategories = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    permissions: [
      { id: 'view_dashboard_analytics', label: 'View Dashboard Analytics' },
      { id: 'view_revenue_insights', label: 'View Revenue Insights' },
    ],
  },
  {
    id: 'riders',
    label: 'Riders',
    permissions: [
      { id: 'view_riders', label: 'View Riders' },
      { id: 'view_rider_details', label: 'View Rider Details' },
      { id: 'suspend_reactive_rider', label: 'Suspend /Reactive Rider' },
    ],
  },
  {
    id: 'drivers',
    label: 'Drivers',
    permissions: [
      { id: 'view_drivers', label: 'View Drivers' },
      { id: 'view_driver_details', label: 'View Driver Details' },
      { id: 'approve_reject_drivers', label: 'Approve / Reject Drivers' },
      { id: 'suspend_activate_driver', label: 'Suspend / Activate Driver' },
    ],
  },
  {
    id: 'verification',
    label: 'Verification Requests',
    permissions: [
      { id: 'view_verification_requests', label: 'View Verification Requests' },
      { id: 'review_documents', label: 'Review Documents' },
      { id: 'approve_reject_verification', label: 'Approve / Reject' },
    ],
  },
  {
    id: 'trips',
    label: 'Trips',
    permissions: [
      { id: 'view_all_trips', label: 'View All Trips' },
      { id: 'view_trip_details', label: 'View Trip Details' },
      { id: 'cancel_ride', label: 'Cancel Ride (Pre-start)' },
      { id: 'force_end_ride', label: 'Force End Ride' },
    ],
  },
  {
    id: 'vehicle',
    label: 'Vehicle Inventory',
    permissions: [
      { id: 'view_categories', label: 'View Categories' },
      { id: 'create_category', label: 'Create Category' },
      { id: 'edit_category', label: 'Edit Category' },
      { id: 'delete_category', label: 'Delete Category' },
    ],
  },
  {
    id: 'support',
    label: 'Support Tickets',
    permissions: [
      { id: 'view_tickets', label: 'View Tickets' },
      { id: 'respond_to_tickets', label: 'Respond to Tickets' },
      { id: 'close_tickets', label: 'Close Tickets' },
    ],
  },
  {
    id: 'pricing',
    label: 'Pricing & Settings',
    permissions: [
      { id: 'view_pricing', label: 'View Pricing' },
      { id: 'edit_pricing_logic', label: 'Edit Pricing Logic' },
    ],
  },
  {
    id: 'push',
    label: 'Push Notifications',
    permissions: [{ id: 'send_notifications', label: 'Send Notifications' }],
  },
  {
    id: 'operators',
    label: 'Operators Management',
    permissions: [
      { id: 'view_operators', label: 'View Operators' },
      { id: 'add_edit_operator', label: 'Add / Edit / Operator' },
      { id: 'remove_operator', label: 'Remove Operator' },
    ],
  },
];

const OperatorModal: React.FC<OperatorModalProps> = ({
  isOpen,
  onClose,
  mode,
  initialData,
  onConfirm,
}) => {
  const isView = mode === 'view';
  const isEdit = mode === 'edit';

  const validationSchema = Yup.object({
    fullName: Yup.string().required('Required'),
    email: Yup.string().email('Invalid email').required('Required'),
    password: isView ? Yup.string() : Yup.string().min(8, 'Too short').required('Required'),
    role: Yup.string().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      fullName: initialData?.name || '',
      email: initialData?.email || '',
      password: initialData?.password || '',
      role: initialData?.role || '',
      permissions: initialData?.permissions || [],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      if (onConfirm) onConfirm(values);
      onClose();
    },
  });

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
                    <input
                      type="text"
                      name="fullName"
                      placeholder="e.g. John Doe"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">Email</label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">
                      {formik.values.email}
                    </p>
                  ) : (
                    <input
                      type="email"
                      name="email"
                      placeholder="e.g. example@email.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium  hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                    Password
                  </label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">
                      {formik.values.password}
                    </p>
                  ) : (
                    <input
                      type="password"
                      name="password"
                      placeholder="********"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium  hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all placeholder:text-[#939999]"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">Role</label>
                  {isView ? (
                    <p className="text-[14px] font-semibold text-[#000000]">{formik.values.role}</p>
                  ) : (
                    <div className="relative">
                      <select
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        className="w-full appearance-none cursor-pointer border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium  hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-all bg-white placeholder:text-[#939999]"
                      >
                        <option value="">Select Role</option>
                        <option value="Super Admin">Admin</option>
                        <option value="Manager">Manager</option>
                        <option value="Operator">Operator</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4E616A] pointer-events-none"
                        size={18}
                      />
                    </div>
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
                      className="border w-[240px] h-[182px] border-[#DFE6E5] rounded-lg p-4 space-y-4"
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
                      <div className="space-y-3 pl-1">
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
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-[#000000] bg-white  cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => formik.handleSubmit()}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-white bg-[#1DAFA1]  cursor-pointer"
            >
              {isEdit ? 'Update Operator' : 'Add Operator'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OperatorModal;
