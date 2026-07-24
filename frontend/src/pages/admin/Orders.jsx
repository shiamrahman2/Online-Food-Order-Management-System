// import { useEffect, useState } from 'react'
// import toast from 'react-hot-toast'
// import { ClipboardList } from 'lucide-react'
// import adminService from '../../services/adminService.js'
// import OrderCard from '../../components/common/OrderCard.jsx'
// import Skeleton from '../../components/common/Skeleton.jsx'
// import EmptyState from '../../components/common/EmptyState.jsx'
// import Modal from '../../components/common/Modal.jsx'
// import { ORDER_STATUS } from '../../utils/constants.js'
// import { getErrorMessage } from '../../utils/helpers.js'

// export default function AdminOrders() {
//   const [orders, setOrders] = useState([])
//   const [riders, setRiders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [assignTarget, setAssignTarget] = useState(null)
//   const [selectedRider, setSelectedRider] = useState('')
//   const [assigning, setAssigning] = useState(false)
//   const [filter, setFilter] = useState('all')

//   const load = () => {
//     setLoading(true)
//     Promise.all([adminService.getOrders(), adminService.getDeliveryPersons()])
//       .then(([ordersRes, ridersRes]) => {
//        // console.log(ridersRes.data.data)
//         setOrders(ordersRes.data.data || [])
//         setRiders((ridersRes.data.data || []).filter((r) => r.is_active && r.is_available))
//       })
//       .catch((err) => toast.error(getErrorMessage(err)))
//       .finally(() => setLoading(false))
//   }

//   useEffect(load, [])

//   const handleAssign = async () => {
//     if (!selectedRider) return
//     setAssigning(true)
//     try {
//       await adminService.assignDelivery(assignTarget.id, Number(selectedRider))
//       toast.success('Delivery person assigned')
//       setAssignTarget(null)
//       setSelectedRider('')
//       load()
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setAssigning(false)
//     }
//   }

//   const filterOptions = ['all', ORDER_STATUS.READY, ORDER_STATUS.ASSIGNED, ORDER_STATUS.PENDING, ORDER_STATUS.DELIVERED]
//   const filtered = filter === 'all' ? orders : orders.filter((o) => o.status === filter)

//   return (
//     <div>
//       <h1 className="font-display text-3xl font-bold text-ink mb-6">All orders</h1>

//       <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
//         {filterOptions.map((f) => (
//           <button
//             key={f}
//             onClick={() => setFilter(f)}
//             className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors capitalize ${
//               filter === f ? 'bg-mango text-white border-mango' : 'bg-white text-ink/70 border-sand hover:border-mango'
//             }`}
//           >
//             {f.replace('_', ' ')}
//           </button>
//         ))}
//       </div>

//       {loading && <Skeleton count={6} />}

//       {!loading && filtered.length === 0 && (
//         <EmptyState icon={ClipboardList} title="No orders here" message="Orders matching this filter will appear here." />
//       )}

//       {!loading && filtered.length > 0 && (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//           {filtered.map((o) => (
//             <OrderCard
//               key={o.id}
//               order={o}
//               meta={
//                 <p className="text-xs text-ink/50 mt-1">
//                   Customer #{o.customer_id} · Restaurant #{o.restaurant_id}
//                   {o.delivery_person_id && ` · Rider #${o.delivery_person_id}`}
//                 </p>
//               }
//               footer={
//                 o.status === ORDER_STATUS.READY && (
//                   <button
//                     onClick={() => setAssignTarget(o)}
//                     className="btn btn-sm bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring"
//                   >
//                     Assign delivery
//                   </button>
//                 )
//               }
//             />
//           ))}
//         </div>
//       )}

//       <Modal open={Boolean(assignTarget)} onClose={() => setAssignTarget(null)} title={`Assign order #${assignTarget?.id}`} size="sm">
//         {riders.length === 0 ? (
//           <p className="text-sm text-ink/60">No active delivery riders available. Add one first.</p>
//         ) : (
//           <>
//             <label className="text-sm font-medium text-ink/70">Choose a rider</label>
//             <select
//               value={selectedRider}
//               onChange={(e) => setSelectedRider(e.target.value)}
//               className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
//             >
//               <option value="">Select a rider...</option>
//               {riders.map((r) => (
//                 <option key={r.id} value={r.id}>{r.name} — {r.vehicle_type}</option>
//               ))}
//             </select>
//             <button
//               onClick={handleAssign}
//               disabled={!selectedRider || assigning}
//               className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-4 focus-ring"
//             >
//               {assigning ? 'Assigning...' : 'Confirm assignment'}
//             </button>
//           </>
//         )}
//       </Modal>
//     </div>
//   )
// }

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList } from 'lucide-react'
import adminService from '../../services/adminService.js'
import OrderCard from '../../components/common/OrderCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { ORDER_STATUS } from '../../utils/constants.js'
import { getErrorMessage } from '../../utils/helpers.js'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [assignTarget, setAssignTarget] = useState(null)
  const [selectedRider, setSelectedRider] = useState('')
  const [assigning, setAssigning] = useState(false)
  const [filter, setFilter] = useState('all')

  const load = () => {
    setLoading(true)

    Promise.all([
      adminService.getOrders(),
      adminService.getDeliveryPersons(),
    ])
      .then(([ordersRes, ridersRes]) => {
        setOrders(ordersRes.data.data || [])

        // Only available delivery persons
        setRiders(
          (ridersRes.data.data || []).filter(
            (r) => r.is_available
          )
        )
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleAssign = async () => {
    if (!selectedRider) return

    setAssigning(true)

    try {
      await adminService.assignDelivery(
        assignTarget.id,
        Number(selectedRider)
      )

      toast.success('Delivery person assigned')

      setAssignTarget(null)
      setSelectedRider('')
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setAssigning(false)
    }
  }

  const filterOptions = [
    'all',
    ORDER_STATUS.READY,
    ORDER_STATUS.ASSIGNED,
    ORDER_STATUS.PENDING,
    ORDER_STATUS.DELIVERED,
  ]

  const filtered =
    filter === 'all'
      ? orders
      : orders.filter((o) => o.status === filter)

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">
        All Orders
      </h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors capitalize ${
              filter === f
                ? 'bg-mango text-white border-mango'
                : 'bg-white text-ink/70 border-sand hover:border-mango'
            }`}
          >
            {f.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading && <Skeleton count={6} />}

      {!loading && filtered.length === 0 && (
        <EmptyState
          icon={ClipboardList}
          title="No orders here"
          message="Orders matching this filter will appear here."
        />
      )}

      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              meta={
                <p className="text-xs text-ink/50 mt-1">
                  Customer #{o.customer_id} · Restaurant #{o.restaurant_id}
                  {o.delivery_person_id &&
                    ` · Rider #${o.delivery_person_id}`}
                </p>
              }
              footer={
                o.status === ORDER_STATUS.READY && (
                  <button
                    onClick={() => setAssignTarget(o)}
                    className="btn btn-sm bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring"
                  >
                    Assign Delivery
                  </button>
                )
              }
            />
          ))}
        </div>
      )}

      <Modal
        open={Boolean(assignTarget)}
        onClose={() => {
          setAssignTarget(null)
          setSelectedRider('')
        }}
        title={`Assign Order #${assignTarget?.id}`}
        size="sm"
      >
        {riders.length === 0 ? (
          <p className="text-sm text-ink/60">
            No available delivery persons.
          </p>
        ) : (
          <>
            <label className="text-sm font-medium text-ink/70">
              Choose a delivery person
            </label>

            <select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
              className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
            >
              <option value="">Select a delivery person...</option>

              {riders.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} — {r.vehicle_type}
                </option>
              ))}
            </select>

            <button
              onClick={handleAssign}
              disabled={!selectedRider || assigning}
              className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-4 focus-ring"
            >
              {assigning ? 'Assigning...' : 'Confirm Assignment'}
            </button>
          </>
        )}
      </Modal>
    </div>
  )
}