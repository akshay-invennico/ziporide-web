export interface AdminUser {
  id: string;
  name: string;
  email: string;
  profile: string | null;
  countryCode?: string;
  isAdmin?: boolean;
  phone?: string;
  gender?: string;
  status?: string;
}

export interface AdminProfileData {
  role: string;
  user: AdminUser;
}

export interface AdminProfileResponse {
  success: boolean;
  message: string;
  data: AdminProfileData;
}

export interface UpdateProfilePayload {
  name: string;
  profile?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
