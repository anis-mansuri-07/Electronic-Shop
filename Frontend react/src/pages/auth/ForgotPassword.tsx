import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  Typography,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material'
import {
  MdVisibility,
  MdVisibilityOff,
  MdEmail,
  MdLock,
  MdVerifiedUser,
} from 'react-icons/md'
import { FaKey } from 'react-icons/fa'
import AuthContainer from '../../components/auth/AuthContainer'
import {
  sendForgotPasswordOtp,
  resetPassword,
  clearError,
} from '../../store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '../../store/hooks'
import type { ResetPassRequest } from '../../types/auth'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)

  const [activeStep, setActiveStep] = useState(0)
  const [otpSent, setOtpSent] = useState(false)
  const [email, setEmail] = useState('')
  const [formData, setFormData] = useState<ResetPassRequest>({
    email: '',
    otp: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string
  }>({})

  useEffect(() => {
    return () => {
      dispatch(clearError())
    }
  }, [dispatch])

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=\S+$).{8,}$/
    return passwordRegex.test(password)
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    if (validationErrors.email) {
      const newErrors = { ...validationErrors }
      delete newErrors.email
      setValidationErrors(newErrors)
    }
    dispatch(clearError())
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (validationErrors[name]) {
      const newErrors = { ...validationErrors }
      delete newErrors[name]
      setValidationErrors(newErrors)
    }
    dispatch(clearError())
  }

  const handleSendOtp = async () => {
    const errors: { email?: string } = {}
    if (!email.trim()) {
      errors.email = 'Email is required'
    } else if (!validateEmail(email)) {
      errors.email = 'Invalid email format'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    const result = await dispatch(sendForgotPasswordOtp({ email }))
    if (sendForgotPasswordOtp.fulfilled.match(result)) {
      setOtpSent(true)
      setFormData((prev) => ({ ...prev, email }))
      setActiveStep(1)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    const errors: { [key: string]: string } = {}

    if (!formData.otp.trim()) {
      errors.otp = 'OTP is required'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (!validatePassword(formData.password)) {
      errors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, special character (!@#$%^&*), and no spaces'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    const result = await dispatch(resetPassword(formData))
    if (resetPassword.fulfilled.match(result)) {
      navigate('/login', {
        state: { message: 'Password reset successful! Please login.' },
      })
    }
  }

  const steps = ['Enter Email', 'Reset Password']

  return (
    <AuthContainer
      title="Reset Password"
      subtitle="Enter your email to receive OTP for password reset"
    >
      <Stepper
        activeStep={activeStep}
        className="mb-8"
        sx={{
          '& .MuiStepLabel-root .Mui-completed': {
            color: '#8b5cf6',
          },
          '& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel': {
            color: '#8b5cf6',
          },
          '& .MuiStepLabel-root .Mui-active': {
            color: '#8b5cf6',
          },
          '& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel': {
            color: '#8b5cf6',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {activeStep === 0 ? (
        <form className="space-y-4">
          {error && (
            <Alert
              severity="error"
              className="mb-4 rounded-xl shadow-md bg-red-50 text-red-800 border border-red-200"
            >
              {error}
            </Alert>
          )}

          <div className="space-y-1">
            <Typography variant="body2" className="text-gray-700 font-medium text-sm ml-1">
              Email Address
            </Typography>
            <TextField
              fullWidth
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              error={!!validationErrors.email}
              helperText={validationErrors.email}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdEmail className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />
          </div>

          <Button
            type="button"
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSendOtp}
            disabled={isLoading}
            className="custom-btn"
          >
            {isLoading ? 'Sending OTP...' : 'Send OTP'}
          </Button>

          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors hover:underline underline-offset-2"
            >
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-4">
          {error && (
            <Alert
              severity="error"
              className="mb-4 rounded-xl shadow-md bg-red-50 text-red-800 border border-red-200"
            >
              {error}
            </Alert>
          )}

          {otpSent && (
            <Alert
              severity="success"
              className="mb-4 rounded-xl shadow-md bg-green-50 text-green-800 border border-green-200"
            >
              OTP has been sent to {email}. Please check your email.
            </Alert>
          )}

          <div className="space-y-1">
            <Typography variant="body2" className="text-gray-700 font-medium text-sm ml-1">
              Enter OTP
            </Typography>
            <TextField
              fullWidth
              name="otp"
              placeholder="Enter the OTP sent to your email"
              value={formData.otp}
              onChange={handleChange}
              error={!!validationErrors.otp}
              helperText={validationErrors.otp || 'Enter the OTP sent to your email'}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdVerifiedUser className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />
          </div>

          <div className="space-y-1">
            <Typography variant="body2" className="text-gray-700 font-medium text-sm ml-1">
              New Password
            </Typography>
            <TextField
              fullWidth
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a new password"
              value={formData.password}
              onChange={handleChange}
              error={!!validationErrors.password}
              helperText={validationErrors.password}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                      className="text-gray-600 hover:bg-purple-50 hover:text-purple-600 p-1"
                    >
                      {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />
          </div>

          <div className="space-y-1">
            <Typography variant="body2" className="text-gray-700 font-medium text-sm ml-1">
              Confirm New Password
            </Typography>
            <TextField
              fullWidth
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your new password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!validationErrors.confirmPassword}
              helperText={validationErrors.confirmPassword}
              disabled={isLoading}
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MdLock className="text-gray-400 text-xl" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      size="small"
                      disabled={isLoading}
                      className="text-gray-600 hover:bg-purple-50 hover:text-purple-600 p-1"
                    >
                      {showConfirmPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="custom-input"
            />
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={() => {
                setActiveStep(0)
                setOtpSent(false)
                setFormData({
                  email: '',
                  otp: '',
                  password: '',
                  confirmPassword: '',
                })
              }}
              disabled={isLoading}
              className="custom-outlined-btn"
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              startIcon={<FaKey size={18} />}
              className="custom-btn"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>

          <div className="text-center">
            <Button
              type="button"
              variant="text"
              size="small"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="text-purple-600 hover:bg-purple-50 px-2 py-1 rounded-md text-sm font-medium"
            >
              Resend OTP
            </Button>
          </div>                                                                    ``
        </form>
      )}
    </AuthContainer>
  )
}

export default ForgotPassword