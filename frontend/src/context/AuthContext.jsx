import { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import authService from '../services/authService'
import {
  getToken,
  getRole,
  getStoredUser,
  setSession,
  clearSession,
  updateStoredUser,
} from '../utils/token'
import { getErrorMessage } from '../utils/helpers'
import { ROLES } from '../utils/constants'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser())
  const [role, setRole] = useState(getRole())
  const [loading, setLoading] = useState(false)

  const isAuthenticated = Boolean(getToken() && user)

  const applySession = (data, roleKey, userField) => {
    const sessionUser = data[userField]
    setSession({ token: data.token, role: roleKey, user: sessionUser })
    setUser(sessionUser)
    setRole(roleKey)
    return sessionUser
  }

  const loginCustomer = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.customerLogin(credentials)
      applySession(res.data.data, ROLES.CUSTOMER, 'customer')
      toast.success('Welcome back!')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const registerCustomer = useCallback(async (payload) => {
    setLoading(true)
    try {
      await authService.customerRegister(payload)
      toast.success('Account created. Please log in.')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loginAdmin = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.adminLogin(credentials)
      applySession(res.data.data, ROLES.ADMIN, 'admin')
      toast.success('Welcome back, admin!')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loginRestaurant = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.restaurantLogin(credentials)
      applySession(res.data.data, ROLES.RESTAURANT, 'restaurant')
      toast.success('Welcome back!')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loginDelivery = useCallback(async (credentials) => {
    setLoading(true)
    try {
      const res = await authService.deliveryLogin(credentials)
      applySession(res.data.data, ROLES.DELIVERY, 'delivery_person')
      toast.success('Welcome back!')
      return true
    } catch (err) {
      toast.error(getErrorMessage(err))
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    setRole(null)
  }, [])

  const refreshUser = useCallback((updatedUser) => {
    updateStoredUser(updatedUser)
    setUser(updatedUser)
  }, [])

  const value = {
    user,
    role,
    loading,
    isAuthenticated,
    loginCustomer,
    registerCustomer,
    loginAdmin,
    loginRestaurant,
    loginDelivery,
    logout,
    refreshUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
