import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, User, Search, Clock } from 'lucide-react'
import orderService from '../../services/orderService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    orderService
      .getMyOrders()
      .then((res) => setOrders((res.data.data || []).slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Hey {user?.name?.split(' ')[0] || 'there'} 👋</h1>
      <p className="text-ink/60 mt-1">What are you craving today?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Link to="/search" className="ticket-card shadow-card p-5 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <span className="w-11 h-11 rounded-full bg-mango/10 text-mango-dark flex items-center justify-center"><Search size={20} /></span>
          <div>
            <p className="font-semibold text-ink">Browse food</p>
            <p className="text-xs text-ink/50">Find your next meal</p>
          </div>
        </Link>
        <Link to="/customer/orders" className="ticket-card shadow-card p-5 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <span className="w-11 h-11 rounded-full bg-basil/10 text-basil flex items-center justify-center"><ShoppingBag size={20} /></span>
          <div>
            <p className="font-semibold text-ink">Your orders</p>
            <p className="text-xs text-ink/50">Track and review</p>
          </div>
        </Link>
        <Link to="/customer/profile" className="ticket-card shadow-card p-5 flex items-center gap-4 hover:shadow-soft transition-shadow">
          <span className="w-11 h-11 rounded-full bg-chili/10 text-chili flex items-center justify-center"><User size={20} /></span>
          <div>
            <p className="font-semibold text-ink">Your profile</p>
            <p className="text-xs text-ink/50">Manage your details</p>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
            <Clock size={18} className="text-mango-dark" /> Recent orders
          </h2>
          <Link to="/customer/orders" className="text-sm text-mango-dark font-semibold hover:underline">View all</Link>
        </div>

        {loading && <Skeleton count={3} />}
        {!loading && orders.length === 0 && (
          <EmptyState title="No orders yet" message="Once you place an order, it'll show up here." />
        )}
        {!loading && orders.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {orders.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
