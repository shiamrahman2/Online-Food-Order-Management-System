import api from './api'

const deliveryService = {
  getProfile: () => api.get('/delivery/profile'),
  updateProfile: (payload) => api.put('/delivery/profile', payload),
  changePassword: (payload) => api.put('/delivery/change-password', payload),

  getOrders: () => api.get('/delivery/orders'),
  updateOrderStatus: (orderId, status) =>
    api.put(`/delivery/orders/${orderId}/status`, { status }),
}

export default deliveryService
