export interface UserProfile {
  id?: number; // if backend returns id
  email: string;
  fullName: string;
  phoneNumber?: string;
  role?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  phoneNumber?: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
}

export interface ApiResponse {
  message: string;
}

export interface AdminResponse {
  id: number;
  adminName: string;
  email: string;
  role: string;
}
