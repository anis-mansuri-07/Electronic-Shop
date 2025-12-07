import { Navigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { Role } from '../types/auth'

interface RoleRouteProps {
  children: React.ReactNode
  allowedRoles: Role[]
}

const RoleRoute = ({
  children,
  allowedRoles,
}: RoleRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect based on user role
    if (user.role === 'ROLE_USER') {
      return <Navigate to="/" replace />
    } else {
      return <Navigate to="/admin/dashboard" replace />
    }
  }

  return <>{children}</>
}

export default RoleRoute

