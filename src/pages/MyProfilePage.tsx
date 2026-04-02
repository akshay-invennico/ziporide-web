import { useEffect, useState } from 'react';

import { useAdminProfile } from '@/hooks/useAdminProfile';
import { useFileUpload } from '@/hooks/useFileUpload';
import type { UpdatePasswordPayload } from '@/types/user.types';

import ChangePasswordModal from '../components/ui/ChangePasswordModal';

const MyProfilePage = () => {
  const { profile, isLoading, getProfile, updateProfile, updatePassword } = useAdminProfile();
  const { uploadImage, isUploading } = useFileUpload();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    profileImage: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');

  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  useEffect(() => {
    if (profile && profile.user) {
      setFormData({
        fullName: profile.user.name || '',
        email: profile.user.email || '',
        profileImage: profile.user.profile || '',
      });
      setPreviewUrl(profile.user.profile || '');
    }
  }, [profile]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      try {
        const imageUrl = await uploadImage(file);
        setFormData((prev) => ({ ...prev, profileImage: imageUrl }));
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleUpdateProfile = async () => {
    await updateProfile({
      name: formData.fullName,
      profile: formData.profileImage,
    });
  };

  const handlePasswordUpdate = async (values: UpdatePasswordPayload) => {
    const success = await updatePassword(values);
    if (success) {
      setIsChangePasswordModalOpen(false);
    }
  };

  return (
    <div className="w-full min-h-full bg-white  p-8 overflow-y-auto">
      <div className="max-w-[641px] mx-auto">
        {/* Header Section */}
        <div className="border-b border-[#DFE6E5] pb-6 mb-6">
          <h2 className="text-[20px] font-semibold text-[#000000] font-inter">My Profile</h2>
          <p className="text-[14px] font-medium text-[#4E616A] font-inter mt-1">
            Manage your personal information and update your account credentials securely.
          </p>
        </div>

        {/* Personal Information Section */}
        <div className="space-y-8">
          <div>
            <h3 className="text-[18px] font-semibold text-[#000000] mb-4">
              Personal Information :
            </h3>

            <div className="space-y-6">
              {/* Profile Photo */}
              <div>
                <label className="block text-[14px] font-medium text-[#4E616A] mb-4">
                  Profile Photo
                </label>
                <div className="relative w-[130px] h-[130px]">
                  <div className="w-full h-full rounded-full border-2 border-dashed border-[#1DAFA1] p-1 overflow-hidden">
                    <img
                      src={previewUrl || '/icons/userProfile.svg'}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  <label className="absolute bottom-1 right-1 w-[32px] h-[32px] bg-[#1DAFA1] rounded-full flex items-center justify-center cursor-pointer ">
                    <img src="/icons/camera.svg" alt="camera" className="w-[18px] h-[18px]" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={isUploading || isLoading}
                    />
                  </label>
                  {(isUploading || isLoading) && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-full">
                      <div className="w-6 h-6 border-2 border-[#1DAFA1] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.fullName}
                    placeholder="e.g. olivia rhye"
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full border border-[#DFE6E5] rounded-md p-3 text-[14px] font-medium text-[#000000] hover:shadow-[0_0_16px_0_rgba(237,155,14,0.2)] focus:outline-none focus:border-[#1DAFA1] transition-colors placeholder:text-[#939999]"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-[14px] font-medium text-[#4E616A] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="e.g. ziporideadmin@gmail.com"
                    readOnly
                    className="w-full border border-[#DFE6E5] bg-gray-50 rounded-md p-3 text-[14px] font-medium text-[#4E616A] focus:outline-none transition-colors placeholder:text-[#939999] cursor-not-allowed"
                  />
                </div>
              </div>

              {/* Update Button */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={handleUpdateProfile}
                  disabled={isLoading || isUploading}
                  className="bg-[#1DAFA1] text-white px-8 py-2.5 rounded-md text-[14px] font-medium cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="pt-4">
            <h3 className="text-[18px] font-semibold text-[#000000] mb-6">Account Security :</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-[16px] font-semibold text-[#000000]">Change Password</h4>
                <p className="text-[14px] font-medium text-[#4E616A] mt-1">
                  Change your password to keep your account secure. Make sure it's strong and
                  unique.
                </p>
              </div>
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                disabled={isLoading}
                className="bg-[#EEFFFD] text-[#1DAFA1] px-6 py-2.5 rounded-md text-[14px] font-medium cursor-pointer disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onUpdate={handlePasswordUpdate}
        isLoading={isLoading}
      />
    </div>
  );
};

export default MyProfilePage;
