import api from './api'

const dashboardService = {
  getAdminDashboard: () => api.get('/admin/dashboard'),
}

export default dashboardService
