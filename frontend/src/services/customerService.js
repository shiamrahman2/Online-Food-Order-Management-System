import api from './api'

const customerService = {
  getProfile: () => api.get('/customer/profile'),
  updateProfile: (payload) => api.put('/customer/profile', payload),
  changePassword: (payload) => api.put('/customer/change-password', payload),
}

export default customerService
