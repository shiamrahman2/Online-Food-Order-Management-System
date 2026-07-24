import api from './api'

const authService = {
  adminRegister: (payload) => api.post('/admin/register', payload),
  adminLogin: (payload) => api.post('/admin/login', payload),

  customerRegister: (payload) => api.post('/customers/register', payload),
  customerLogin: (payload) => api.post('/customer/login', payload),

  restaurantLogin: (payload) => api.post('/restaurants/login', payload),

  deliveryLogin: (payload) => api.post('/delivery/login', payload),
}

export default authService
