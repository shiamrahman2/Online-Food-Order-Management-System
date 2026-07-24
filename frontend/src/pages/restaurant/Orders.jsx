import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'
import restaurantService from '../../services/restaurantService.js'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { ORDER_STATUS } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/helpers.js'

const NEXT_ACTIONS = {
  [ORDER_STATUS.PENDING]: [
    { status: ORDER_STATUS.ACCEPTED, label: 'Accept', className: 'bg-basil hover:bg-basil/90 text-white border-none' },
    { status: ORDER_STATUS.REJECTED, label: 'Reject', className: 'btn-outline border-chili text-chili hover:bg-chili hover:text-white' },
  ],
  [ORDER_STATUS.ACCEPTED]: [
    { status: ORDER_STATUS.PREPARING, label: 'Start preparing', className: 'bg-mango hover:bg-mango-dark text-white border-none' },
  ],
  [ORDER_STATUS.PREPARING]: [
    { status: ORDER_STATUS.READY, label: 'Mark ready', className: 'bg-mango hover:bg-mango-dark text-white border-none' },
  ],
}

export default function RestaurantOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)
    restaurantService
      .getOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId)
    try {
      await restaurantService.updateOrderStatus(orderId, status)
      toast.success(`Order marked as ${status}`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)
  const filterOptions = ['all', ORDER_STATUS.PENDING, ORDER_STATUS.ACCEPTED, ORDER_STATUS.PREPARING, ORDER_STATUS.READY]

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Orders</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors capitalize ${
              filter === f ? 'bg-mango text-white border-mango' : 'bg-white text-ink/70 border-sand hover:border-mango'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && <Skeleton count={4} />}

      {!loading && filtered.length === 0 && (
        <EmptyState icon={ClipboardList} title="No orders here" message="Orders matching this filter will appear here." />
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              footer={(NEXT_ACTIONS[o.status] || []).map((action) => (
                <button
                  key={action.status}
                  disabled={updatingId === o.id}
                  onClick={() => handleStatusUpdate(o.id, action.status)}
                  className={`btn btn-sm rounded-full focus-ring ${action.className}`}
                >
                  {action.label}
                </button>
              ))}
            />
          ))}
        </div>
      )}
    </div>
  )
}
