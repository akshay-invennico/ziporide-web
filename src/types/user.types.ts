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

export interface OperatorProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  countryCode?: string;
  profilePhotoUrl: string | null;
  role?: string;
  permissions?: string[];
  status?: string;
}

export interface OperatorProfileResponse {
  success: boolean;
  data: {
    operator: OperatorProfile;
  };
}

export interface UpdateOperatorProfilePayload {
  name?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  profilePhotoUrl?: string;
}

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
}
