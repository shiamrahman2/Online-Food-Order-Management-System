import api from './api'

const menuService = {
  searchFood: (query) => api.get('/menu/search', { params: { q: query } }),

  getMyMenu: () => api.get('/restaurant/menu'),
  createMenu: (payload) => api.post('/restaurant/menu', payload),
  updateMenu: (id, payload) => api.put(`/restaurant/menu/${id}`, payload),
  deleteMenu: (id) => api.delete(`/restaurant/menu/${id}`),
  getByID: (id) =>api.get(`/menu/${id}`),
}

export default menuService
