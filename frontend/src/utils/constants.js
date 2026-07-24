export const BASE_URL = 'http://localhost:8080/api'

export const ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  RESTAURANT: 'restaurant',
  DELIVERY: 'delivery',
}

export const ROLE_HOME = {
  [ROLES.CUSTOMER]: '/home',
  [ROLES.ADMIN]: '/admin/dashboard',
  [ROLES.RESTAURANT]: '/restaurant/dashboard',
  [ROLES.DELIVERY]: '/delivery/dashboard',
}

// Order status progression, used for badges and step trackers.
export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  ASSIGNED: 'assigned',
  PICKED_UP: 'picked_up',
  ON_THE_WAY: 'on_the_way',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REJECTED: 'rejected',
}

export const ORDER_STATUS_LABEL = {
  pending: 'Pending',
  accepted: 'Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  assigned: 'Assigned',
  picked_up: 'Picked up',
  on_the_way: 'On the way',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  rejected: 'Rejected',
}

export const ORDER_STATUS_COLOR = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  accepted: 'bg-sky-100 text-sky-800 border-sky-200',
  preparing: 'bg-mango-light/30 text-mango-dark border-mango-light',
  ready: 'bg-violet-100 text-violet-800 border-violet-200',
  assigned: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  picked_up: 'bg-teal-100 text-teal-800 border-teal-200',
  on_the_way: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-basil/10 text-basil border-basil/30',
  cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  rejected: 'bg-chili/10 text-chili border-chili/30',
}
