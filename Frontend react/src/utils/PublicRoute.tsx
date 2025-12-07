import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { Role } from '../types/auth'

// Route that blocks admin/super admin but allows everyone else (logged in or not)
const PublicRoute = () => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  // If admin or super admin tries to access, redirect to admin dashboard
  if (isAuthenticated && user) {
    if (user.role === Role.ROLE_ADMIN || user.role === Role.ROLE_SUPER_ADMIN) {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return <Outlet />
}

export default PublicRoute

