import api from './api'
import type {
  LoginRequest,
  RegisterRequest,
  ResetPassRequest,
  AuthResponse,
  ApiResponse,
} from '../types/auth'

export const authService = {
  // Send OTP for registration
  sendRegisterOtp: async (email: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/register/send-otp', {
      email,
    })
    return response.data
  },

  // Register user
  register: async (data: RegisterRequest): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/register', data)
    return response.data
  },

  // Login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  // Send OTP for forgot password
  sendForgotPasswordOtp: async (email: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/forgot-password/send-otp', {
      email,
    })
    return response.data
  },

  // Reset password
  resetPassword: async (data: ResetPassRequest): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/forgot-password/reset', data)
    return response.data
  },
}

