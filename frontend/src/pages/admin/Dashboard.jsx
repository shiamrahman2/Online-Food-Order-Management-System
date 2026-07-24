import { useEffect, useState } from 'react'
import { Users, Store, Bike, ShoppingBag, DollarSign, Clock, CheckCircle2 } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Loading from '../../components/common/Loading.jsx'
import { formatCurrency, getErrorMessage } from '../../utils/helpers.js'
import toast from 'react-hot-toast'

const STAT_CARDS = [
  { key: 'total_customers', label: 'Customers', icon: Users, color: 'bg-mango/10 text-mango-dark' },
  { key: 'total_restaurants', label: 'Restaurants', icon: Store, color: 'bg-basil/10 text-basil' },
  { key: 'total_delivery_persons', label: 'Delivery riders', icon: Bike, color: 'bg-chili/10 text-chili' },
  { key: 'total_orders', label: 'Total orders', icon: ShoppingBag, color: 'bg-indigo-100 text-indigo-700' },
  { key: 'total_revenue', label: 'Revenue', icon: DollarSign, color: 'bg-emerald-100 text-emerald-700', currency: true },
  { key: 'pending_orders', label: 'Pending orders', icon: Clock, color: 'bg-amber-100 text-amber-700' },
  { key: 'completed_orders', label: 'Completed orders', icon: CheckCircle2, color: 'bg-sky-100 text-sky-700' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminService
      .getDashboard()
      .then((res) => setStats(res.data.data))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading fullScreen label="Loading dashboard..." />

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Admin overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((card) => (
          <div key={card.key} className="ticket-card shadow-card p-5 flex items-center gap-4">
            <span className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${card.color}`}>
              <card.icon size={22} />
            </span>
            <div>
              <p className="text-2xl font-bold text-ink font-display">
                {card.currency ? formatCurrency(stats?.[card.key]) : stats?.[card.key] ?? 0}
              </p>
              <p className="text-xs text-ink/50">{card.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
