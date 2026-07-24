import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ROLES } from '../utils/constants.js'

export default function GuestOrCustomerRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return null

  // Guest
  if (!user) {
    return children
  }

  // Customer
  if (user.role === ROLES.CUSTOMER) {
    return children
  }

  // Restaurant
  if (user.role === ROLES.RESTAURANT) {
    return <Navigate to="/restaurant/dashboard" replace />
  }

  // Admin
  if (user.role === ROLES.ADMIN) {
    return <Navigate to="/admin/dashboard" replace />
  }

  // Delivery
  if (user.role === ROLES.DELIVERY) {
    return <Navigate to="/delivery/dashboard" replace />
  }

  return <Navigate to="/login" replace />
}