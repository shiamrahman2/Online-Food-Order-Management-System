import api from './api'

const paymentService = {
  createPayment: (payload) => api.post('/payments', payload),
  getPaymentByOrder: (orderId) => api.get('/payments', { params: { order_id: orderId } }),
}

export default paymentService
