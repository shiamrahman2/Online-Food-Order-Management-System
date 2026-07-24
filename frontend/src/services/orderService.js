import api from './api'

const orderService = {
  createOrder: (payload) => api.post('/customer/orders', payload),
  getMyOrders: () => api.get('/customer/orders'),
  cancelOrder: (orderId) => api.put(`/customer/orders/${orderId}/cancel`),
}

export default orderService
