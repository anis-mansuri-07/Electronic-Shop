import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'

interface ProtectedRouteProps {
  requireAuth?: boolean
  redirectTo?: string
}

const ProtectedRoute = ({
  requireAuth = true,
  redirectTo = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  // If route requires auth and user is not authenticated, redirect to login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} replace />
  }

  // If route requires no auth (like login/register) and user is authenticated, redirect based on role
  if (!requireAuth && isAuthenticated && user) {
    if (user.role === 'ROLE_USER') {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return <Outlet />
}

export default ProtectedRoute

