import api from './api'

const adminService = {
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (payload) => api.put('/admin/profile', payload),
  changePassword: (payload) => api.put('/admin/change-password', payload),

  getDashboard: () => api.get('/admin/dashboard'),

  getRestaurants: () => api.get('/admin/restaurants'),
  createRestaurant: (payload) => api.post('/admin/restaurants', payload),
  updateRestaurant: (id, payload) => api.put(`/admin/restaurants/${id}`, payload),
  deleteRestaurant: (id) => api.delete(`/admin/restaurants/${id}`),

  getCustomers: () => api.get('/admin/customers'),

  getOrders: () => api.get('/admin/orders'),
  assignDelivery: (orderId, deliveryPersonId) =>
    api.put(`/admin/orders/${orderId}/assign`, { delivery_person_id: deliveryPersonId }),

  getDeliveryPersons: () => api.get('/admin/delivery-persons'),
  createDeliveryPerson: (payload) => api.post('/admin/delivery-persons', payload),
  updateDeliveryPerson: (id, payload) => api.put(`/admin/delivery-persons/${id}`, payload),
  deleteDeliveryPerson: (id) => api.delete(`/admin/delivery-persons/${id}`),

  getPayments: () => api.get('/admin/payments'),
  updatePaymentStatus: (id, payload) => api.put(`/admin/payments/${id}/status`, payload),
}

export default adminService
