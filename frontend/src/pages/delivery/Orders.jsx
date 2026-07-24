import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Bike } from 'lucide-react'
import deliveryService from '../../services/deliveryService.js'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { ORDER_STATUS } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/helpers.js'

const NEXT_ACTIONS = {
  [ORDER_STATUS.ASSIGNED]: [{ status: ORDER_STATUS.PICKED_UP, label: 'Mark picked up' }],
  [ORDER_STATUS.PICKED_UP]: [{ status: ORDER_STATUS.ON_THE_WAY, label: 'Start delivery' }],
  [ORDER_STATUS.ON_THE_WAY]: [{ status: ORDER_STATUS.DELIVERED, label: 'Mark delivered' }],
}

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)

  const load = () => {
    setLoading(true)
    deliveryService
      .getOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleStatusUpdate = async (orderId, status) => {
    setUpdatingId(orderId)
    try {
      await deliveryService.updateOrderStatus(orderId, status)
      toast.success(`Order marked as ${status.replace('_', ' ')}`)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setUpdatingId(null)
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Assigned orders</h1>

      {loading && <Skeleton count={4} />}

      {!loading && orders.length === 0 && (
        <EmptyState icon={Bike} title="No deliveries assigned" message="When the admin assigns you an order, it'll show up here." />
      )}

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              footer={(NEXT_ACTIONS[o.status] || []).map((action) => (
                <button
                  key={action.status}
                  disabled={updatingId === o.id}
                  onClick={() => handleStatusUpdate(o.id, action.status)}
                  className="btn btn-sm bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring"
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
