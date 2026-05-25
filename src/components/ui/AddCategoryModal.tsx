import { useFormik } from 'formik';
import { X } from 'lucide-react';
import React, { useRef, useState, useEffect } from 'react';
import * as Yup from 'yup';

import type { VehicleCategory } from '@/types/vehicle.types';

import LoadingSpinner from './LoadingSpinner';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (values: {
    categoryName: string;
    baseFare: string;
    pricePerMile: string;
    pricePerMinute: string;
    vehicleType: string;
    seatCapacity: string;
    categoryIcon: File | string | null;
    order: string;
  }) => void;
  initialData?: VehicleCategory | null;
  existingCategories?: VehicleCategory[];
  isLoading?: boolean;
}

const InputWrapper = ({
  label,
  required = false,
  error,
  infoText,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  infoText?: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-2 ">
    <div className="flex justify-between items-center">
      <label className="text-[14px] font-medium font-inter text-[#4E616A] flex items-center gap-1">
        {label}
        {required && <span className="text-[#FF0707]">*</span>}
      </label>
      {infoText && (
        <div className="flex items-center gap-1.5 opacity-70">
          <img src="/icons/vehicle/info.svg" alt="info" className="w-[15px] h-[15px]" />
          <span className="text-[12px] font-medium text-[#4E616A]">{infoText}</span>
        </div>
      )}
    </div>
    {children}
    {error && <span className="text-[12px] text-[#FF0707] mt-1">{error}</span>}
  </div>
);

const CustomDropdown = ({
  options,
  value,
  onChange,
  onBlur,
  placeholder,
  hasError,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  onBlur: () => void;
  placeholder: string;
  hasError?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onBlur();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onBlur]);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full cursor-pointer bg-white border ${hasError ? 'border-[#FF0707]' : 'border-[#DFE6E5]'} rounded-md p-3 pr-10 text-[14px] font-medium focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all flex items-center justify-between ${value ? 'text-[#000000]' : 'text-[#939999]'}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{value || placeholder}</span>
        <svg
          className={`w-[12px] h-[8px] text-[#4E616A] transition-transform absolute right-4 top-1/2 -translate-y-1/2 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 1.5L6 6.5L11 1.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-2 bg-white border border-[#DFE6E5] rounded-xl shadow-[0_4px_16px_0_rgba(0,0,0,0.08)] overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-5 py-3.5 cursor-pointer text-[16px] font-medium hover:bg-[#F9F9F9] transition-colors truncate ${value === option.value ? 'text-[#1DAFA1]' : 'text-[#000000]'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialData,
  existingCategories = [],
  isLoading = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isEditing = !!initialData;
  const nextAvailableOrder =
    Array.from({ length: 7 }, (_, index) => index + 1).find(
      (order) => !existingCategories.some((category) => category.order === order),
    ) ?? null;

  const validationSchema = Yup.object({
    categoryName: Yup.string().required('Required'),
    order: Yup.string()
      .required('Required')
      .matches(/^\d+$/, 'Must be an integer')
      .test('range', 'Must be between 1 and 7', (value) => {
        if (!value || !/^\d+$/.test(value)) return false;
        const order = Number(value);
        return order >= 1 && order <= 7;
      })
      .test('unique', 'This display order is already used by another category.', (value) => {
        if (!value || !/^\d+$/.test(value)) return true;
        const order = Number(value);
        return !existingCategories.some(
          (category) => category.order === order && category.id !== initialData?.id,
        );
      }),
    baseFare: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .required('Required'),
    pricePerMile: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .required('Required'),
    pricePerMinute: Yup.number()
      .typeError('Must be a number')
      .positive('Must be positive')
      .required('Required'),
    vehicleType: Yup.string().required('Required'),
    seatCapacity: Yup.string().required('Required'),
    categoryIcon: Yup.mixed().required('Required'),
  });

  const formik = useFormik({
    initialValues: {
      categoryName: initialData?.name || '',
      baseFare: initialData?.basePrice?.toString() || '',
      pricePerMile: initialData?.pricePerMile?.toString() || '',
      pricePerMinute: initialData?.pricePerMinute?.toString() || '',
      vehicleType: initialData?.vehicleType || '',
      seatCapacity: initialData?.seats ? `${initialData.seats} Seats` : '',
      categoryIcon: initialData?.categoryIcon || (null as File | string | null),
      order: initialData?.order?.toString() || nextAvailableOrder?.toString() || '',
    },
    enableReinitialize: true,
    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: (values) => {
      if (onConfirm) {
        onConfirm(values);
      } else {
        formik.resetForm();
        onClose();
      }
    },
  });

  useEffect(() => {
    if (!isOpen) {
      formik.resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]); // Removed formik from dependencies to prevent infinite loop

  // Derived state to show a preview
  const previewUrl =
    typeof formik.values.categoryIcon === 'string'
      ? formik.values.categoryIcon
      : formik.values.categoryIcon instanceof File
        ? URL.createObjectURL(formik.values.categoryIcon)
        : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-[0_0_16px_0_rgba(237,155,14,0.2)] border border-[#DFE6E5]  w-[520px] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#DFE6E5] shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-[58px] h-[58px] bg-[#EEFFFD] rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/icons/vehicle/createCar.svg"
                alt="add"
                className="w-[70%] h-[70%] object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-[18px] font-semibold text-[#000000] font-inter">
                {isEditing ? 'Edit Vehicle Category' : 'Create New Vehicle Category'}
              </h2>
              <p className="text-[14px] font-medium text-[#4E616A] font-inter">
                {isEditing ? 'Update vehicle category details.' : 'Define a new vehicle category.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 cursor-pointer text-[#4E616A] ">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <form className="flex flex-col gap-5">
            <InputWrapper
              label="Category Name"
              required
              error={formik.errors.categoryName as string}
            >
              <input
                type="text"
                name="categoryName"
                placeholder="e.g. Economy, Premium, SUV"
                value={formik.values.categoryName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border ${
                  formik.errors.categoryName ? 'border-[#FF0707]' : 'border-[#DFE6E5]'
                } rounded-md p-3 text-[14px] text-[#000000] font-medium placeholder-[#939999] focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all`}
              />
            </InputWrapper>

            <InputWrapper
              label="Display Order"
              required
              infoText="1 appears first. Maximum 7 categories are supported."
              error={formik.errors.order as string}
            >
              <input
                type="number"
                name="order"
                min={1}
                max={7}
                step={1}
                placeholder="1"
                value={formik.values.order}
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === '' || /^\d+$/.test(value)) {
                    formik.setFieldValue('order', value);
                  }
                }}
                onKeyDown={(event) => {
                  if (['e', 'E', '+', '-', '.'].includes(event.key)) {
                    event.preventDefault();
                  }
                }}
                onBlur={formik.handleBlur}
                className={`w-full border ${
                  formik.errors.order ? 'border-[#FF0707]' : 'border-[#DFE6E5]'
                } rounded-md p-3 text-[14px] text-[#000000] font-medium placeholder-[#939999] focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all`}
              />
            </InputWrapper>

            <InputWrapper
              label="Base Fare"
              infoText="Initial charge when ride starts"
              error={formik.errors.baseFare as string}
            >
              <input
                type="text"
                name="baseFare"
                placeholder="e.g. £10.00"
                value={formik.values.baseFare}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border ${
                  formik.errors.categoryName ? 'border-[#FF0707]' : 'border-[#DFE6E5]'
                } rounded-md p-3 text-[14px] text-[#000000] font-medium  placeholder-[#939999] focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all`}
              />
            </InputWrapper>

            <InputWrapper
              label="Price per Mile"
              infoText="Charge per mile travelled"
              error={formik.errors.pricePerMile as string}
            >
              <input
                type="text"
                name="pricePerMile"
                placeholder="e.g. £10.00"
                value={formik.values.pricePerMile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border ${
                  formik.errors.categoryName ? 'border-[#FF0707]' : 'border-[#DFE6E5]'
                } rounded-md p-3 text-[14px] text-[#000000] font-medium placeholder-[#939999] focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all`}
              />
            </InputWrapper>

            <InputWrapper
              label="Price per Minute"
              infoText="Charge per minute of ride time"
              error={formik.errors.pricePerMinute as string}
            >
              <input
                type="text"
                name="pricePerMinute"
                placeholder="e.g. £10.00"
                value={formik.values.pricePerMinute}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`w-full border ${
                  formik.errors.categoryName ? 'border-[#FF0707]' : 'border-[#DFE6E5]'
                } rounded-md p-3 text-[14px] text-[#000000] font-medium placeholder-[#939999] focus:outline-none focus:border-[#1DAFA1] focus:ring-1 focus:ring-[#1DAFA1] transition-all`}
              />
            </InputWrapper>

            <InputWrapper label="Vehicle Type" required error={formik.errors.vehicleType as string}>
              <CustomDropdown
                options={[
                  { label: 'Car', value: 'car' },
                  { label: 'Bike', value: 'bike' },
                  { label: 'Van', value: 'van' },
                ]}
                value={formik.values.vehicleType}
                onChange={(val) => formik.setFieldValue('vehicleType', val)}
                onBlur={() => formik.setFieldTouched('vehicleType', true)}
                placeholder="Select Vehicle Type"
                hasError={!!formik.errors.vehicleType}
              />
            </InputWrapper>

            <InputWrapper
              label="Seat Capacity"
              required
              error={formik.errors.seatCapacity as string}
            >
              <CustomDropdown
                options={[
                  { label: '1 Seat', value: '1 Seat' },
                  { label: '2 Seats', value: '2 Seats' },
                  { label: '4 Seats', value: '4 Seats' },
                  { label: '6 Seats', value: '6 Seats' },
                ]}
                value={formik.values.seatCapacity}
                onChange={(val) => formik.setFieldValue('seatCapacity', val)}
                onBlur={() => formik.setFieldTouched('seatCapacity', true)}
                placeholder="Select Seat Capacity"
                hasError={!!formik.errors.seatCapacity}
              />
            </InputWrapper>

            <InputWrapper
              label="Category Icon"
              required
              error={formik.errors.categoryIcon as string}
            >
              {previewUrl ? (
                <div className="relative inline-block w-fit">
                  <div className="w-[120px] h-[120px] rounded-xl bg-[#F4F4F4] overflow-hidden flex items-center justify-center border border-gray-100 p-2">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      formik.setFieldValue('categoryIcon', null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="absolute top-[-8px] right-[-8px] w-6 h-6 bg-[#333333] rounded-full flex items-center justify-center text-white cursor-pointer hover:bg-black"
                  >
                    <X className="w-[20px] h-[20px]" />
                  </button>
                </div>
              ) : (
                <div
                  className={`w-full border-2 border-dashed ${formik.errors.categoryIcon ? 'border-[#FF0707]' : 'border-[#DFE6E5]'} rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer `}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        formik.setFieldValue('categoryIcon', e.target.files[0]);
                      }
                    }}
                  />
                  <div className="w-[48px] h-[48px] bg-[#F9F9F9] rounded-full flex items-center justify-center">
                    <img src="/icons/vehicle/uploadImage.svg" alt="upload" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[14px] font-medium text-[#000000]">Click to upload</span>
                    <span className="text-[10px] font-medium text-[#4E616A]">
                      JPG or PNG (Max 2MB)
                    </span>
                  </div>
                </div>
              )}
            </InputWrapper>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 flex flex-col gap-4  shrink-0">
          <div className="flex justify-end gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-[#000000] bg-transparent  cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => formik.handleSubmit()}
              disabled={isLoading}
              className="px-6 py-2.5 rounded-md text-[14px] font-medium text-white bg-[#1DAFA1] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
            >
              {isLoading ? (
                <LoadingSpinner size={20} className="text-white" />
              ) : isEditing ? (
                'Update Category'
              ) : (
                'Create Category'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategoryModal;
