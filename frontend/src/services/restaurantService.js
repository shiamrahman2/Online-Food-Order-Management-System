import api from './api'

const restaurantService = {
  // Public
  getAllRestaurants: () => api.get('/restaurants'),
  getRestaurantMenu: (restaurantId) => api.get(`/restaurant/${restaurantId}/menu`),

  // Restaurant self-service (requires restaurant token) 
  getProfile: () => api.get('/restaurant/profile'),
  updateProfile: (payload) => api.put('/restaurant/profile', payload),
  changePassword: (payload) => api.put('/restaurant/change-password', payload),

  getOrders: () => api.get('/restaurant/orders'),
  updateOrderStatus: (orderId, status) =>
    api.put(`/restaurant/orders/${orderId}/status`, { status }),
}

export default restaurantService
