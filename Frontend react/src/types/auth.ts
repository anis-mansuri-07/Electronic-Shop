export const Role = {
  ROLE_USER: "ROLE_USER",
  ROLE_ADMIN: "ROLE_ADMIN",
  ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  otp: string;
}

export interface OtpRequest {
  email: string;
}

export interface ResetPassRequest {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  jwt: string;
  role: Role;
  message: string;
  fullName: string;
}

export interface ApiResponse {
  message: string;
}

export interface User {
  id: number;
  email: string;
  role: Role;
  token: string;
  fullName: string;
}
