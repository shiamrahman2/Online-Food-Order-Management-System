import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bike, PackageCheck, Clock } from 'lucide-react'
import deliveryService from '../../services/deliveryService.js'
import { useAuth } from '../../context/AuthContext.jsx'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { ORDER_STATUS } from '../../utils/constants.js'

export default function DeliveryDashboard() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    deliveryService
      .getOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const active = orders.filter((o) => o.status !== ORDER_STATUS.DELIVERED)
  const delivered = orders.filter((o) => o.status === ORDER_STATUS.DELIVERED)

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink">Hey {user?.name?.split(' ')[0]} 🛵</h1>
      <p className="text-ink/60 mt-1">Ready to hit the road?</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="ticket-card shadow-card p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-mango/10 text-mango-dark flex items-center justify-center"><Bike size={20} /></span>
          <div>
            <p className="text-2xl font-bold text-ink font-display">{active.length}</p>
            <p className="text-xs text-ink/50">Active deliveries</p>
          </div>
        </div>
        <div className="ticket-card shadow-card p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-basil/10 text-basil flex items-center justify-center"><PackageCheck size={20} /></span>
          <div>
            <p className="text-2xl font-bold text-ink font-display">{delivered.length}</p>
            <p className="text-xs text-ink/50">Delivered</p>
          </div>
        </div>
        <div className="ticket-card shadow-card p-5 flex items-center gap-4">
          <span className="w-11 h-11 rounded-full bg-chili/10 text-chili flex items-center justify-center"><Clock size={20} /></span>
          <div>
            <p className="text-2xl font-bold text-ink font-display">{orders.length}</p>
            <p className="text-xs text-ink/50">Total assigned</p>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-ink">Active deliveries</h2>
          <Link to="/delivery/orders" className="text-sm text-mango-dark font-semibold hover:underline">View all</Link>
        </div>
        {loading && <Skeleton count={3} />}
        {!loading && active.length === 0 && <EmptyState title="No active deliveries" message="New assignments from the admin will show up here." />}
        {!loading && active.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {active.slice(0, 3).map((o) => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  )
}
