import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ShoppingBag } from 'lucide-react'
import orderService from '../../services/orderService.js'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { ORDER_STATUS } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/helpers.js'

export default function CustomerOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelTarget, setCancelTarget] = useState(null)
  const [cancelling, setCancelling] = useState(false)

  const load = () => {
    setLoading(true)
    orderService
      .getMyOrders()
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleCancel = async () => {
    setCancelling(true)
    try {
      await orderService.cancelOrder(cancelTarget.id)
      toast.success('Order cancelled')
      setCancelTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Your orders</h1>

      {loading && <Skeleton count={4} />}

      {!loading && orders.length === 0 && (
        <EmptyState icon={ShoppingBag} title="No orders yet" message="Your order history will show up here." />
      )}

      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              footer={
                o.status === ORDER_STATUS.PENDING && (
                  <button
                    onClick={() => setCancelTarget(o)}
                    className="btn btn-sm btn-outline border-chili text-chili hover:bg-chili hover:text-white rounded-full focus-ring"
                  >
                    Cancel order
                  </button>
                )
              }
            />
          ))}
        </div>
      )}

      <Modal open={Boolean(cancelTarget)} onClose={() => setCancelTarget(null)} title="Cancel this order?" size="sm">
        <p className="text-sm text-ink/60">
          Order #{cancelTarget?.id} will be cancelled. This can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setCancelTarget(null)} className="btn btn-ghost flex-1 rounded-xl focus-ring">
            Keep order
          </button>
          <button onClick={handleCancel} disabled={cancelling} className="btn bg-chili hover:bg-chili-dark text-white border-none flex-1 rounded-xl focus-ring">
            {cancelling ? 'Cancelling...' : 'Yes, cancel'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
