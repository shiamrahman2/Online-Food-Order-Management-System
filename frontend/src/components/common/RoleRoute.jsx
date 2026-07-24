import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLE_HOME } from '../../utils/constants'

export default function RoleRoute({ allow, children }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (!allow.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || '/'} replace />
  }
  return children
}
