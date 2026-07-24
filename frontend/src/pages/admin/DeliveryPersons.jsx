// import { useEffect, useState } from 'react'
// import { Link,useNavigate } from 'react-router-dom'
// import toast from 'react-hot-toast'
// import { Plus, Bike, Trash2,Pencil } from 'lucide-react'
// import adminService from '../../services/adminService.js'
// import Skeleton from '../../components/common/Skeleton.jsx'
// import EmptyState from '../../components/common/EmptyState.jsx'
// import Modal from '../../components/common/Modal.jsx'
// import { getErrorMessage } from '../../utils/helpers.js'

// export default function AdminDeliveryPersons() {
//   const [riders, setRiders] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [deleteTarget, setDeleteTarget] = useState(null)
//   const [deleting, setDeleting] = useState(false)

//   const load = () => {
//     setLoading(true)
//     adminService
//       .getDeliveryPersons()
//       .then((res) => setRiders(res.data.data || []))
//       .catch((err) => toast.error(getErrorMessage(err)))
//       .finally(() => setLoading(false))
//   }

//   useEffect(load, [])

//   const handleDelete = async () => {
//     setDeleting(true)
//     try {
//       await adminService.deleteDeliveryPerson(deleteTarget.id)
//       toast.success('Delivery person removed')
//       setDeleteTarget(null)
//       load()
//     } catch (err) {
//       toast.error(getErrorMessage(err))
//     } finally {
//       setDeleting(false)
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6">
//         <h1 className="font-display text-3xl font-bold text-ink">Delivery persons</h1>
//         <Link to="/admin/delivery-persons/create" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring">
//           <Plus size={16} /> Add rider
//         </Link>
//       </div>

//       {loading && <Skeleton count={6} />}

//       {!loading && riders.length === 0 && (
//         <EmptyState icon={Bike} title="No delivery riders yet" message="Add riders so orders can be assigned for delivery." />
//       )}

//       {!loading && riders.length > 0 && (
//         <div className="overflow-x-auto ticket-card shadow-card">
//           <table className="table w-full">
//             <thead>
//               <tr className="text-xs uppercase text-ink/50 border-b border-sand">
//                 <th className="py-3 px-4 text-left">Name</th>
//                 <th className="py-3 px-4 text-left">Contact</th>
//                 <th className="py-3 px-4 text-left">Vehicle</th>
//                 <th className="py-3 px-4 text-left">Availability</th>
//                 <th className="py-3 px-4 text-left">Active</th>
//                 <th className="py-3 px-4 text-right">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {riders.map((r) => (
//                 <tr key={r.id} className="border-b border-sand/60 last:border-none">
//                   <td className="py-3 px-4 font-medium text-ink">{r.name}</td>
//                   <td className="py-3 px-4 text-ink/60">
//                     <div>{r.email}</div>
//                     <div className="text-xs">{r.phone}</div>
//                   </td>
//                   <td className="py-3 px-4 text-ink/60 capitalize">{r.vehicle_type} · {r.vehicle_number}</td>
//                   <td className="py-3 px-4">
//                     <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.is_available ? 'bg-basil/10 text-basil' : 'bg-gray-100 text-gray-500'}`}>
//                       {r.is_available ? 'Available' : 'Busy'}
//                     </span>
//                   </td>
//                   <td className="py-3 px-4">
//                     <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.is_available ? 'bg-basil/10 text-basil' : 'bg-gray-100 text-gray-500'}`}>
//                       {/* {r.is_active ? 'YES' : 'NO'} */}
//                     </span>
//                   </td>
//                   {/* <td className="py-3 px-4 text-right">

//                     <button onClick={() => setDeleteTarget(r)} className="btn btn-sm btn-ghost text-chili focus-ring" aria-label="Delete"><Trash2 size={15} /></button>
//                   </td> */}
//                    <td className="py-3 px-4 text-right">
//                     <div className="flex justify-end gap-2">
//                    {/* <button  className="btn btn-sm btn-ghost focus-ring" aria-label="Edit"><Pencil size={15} /></button> */}
//                     <button onClick={() => setDeleteTarget(r)} className="btn btn-sm btn-ghost text-chili focus-ring" aria-label="Delete"><Trash2 size={15} /></button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Remove this rider?" size="sm">
//         <p className="text-sm text-ink/60">"{deleteTarget?.name}" will no longer be assignable to orders.</p>
//         <div className="flex gap-3 mt-6">
//           <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost flex-1 rounded-xl focus-ring">Cancel</button>
//           <button onClick={handleDelete} disabled={deleting} className="btn bg-chili hover:bg-chili-dark text-white border-none flex-1 rounded-xl focus-ring">
//             {deleting ? 'Removing...' : 'Remove'}
//           </button>
//         </div>
//       </Modal>
//     </div>
//   )
// }
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Bike, Trash2 } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function AdminDeliveryPersons() {
  const [riders, setRiders] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const load = () => {
    setLoading(true)
    adminService
      .getDeliveryPersons()
      .then((res) => setRiders(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminService.deleteDeliveryPerson(deleteTarget.id)
      toast.success('Delivery person removed')
      setDeleteTarget(null)
      load()
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-3xl font-bold text-ink">
          Delivery Persons
        </h1>

        <Link
          to="/admin/delivery-persons/create"
          className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring"
        >
          <Plus size={16} /> Add Rider
        </Link>
      </div>

      {loading && <Skeleton count={6} />}

      {!loading && riders.length === 0 && (
        <EmptyState
          icon={Bike}
          title="No delivery riders yet"
          message="Add riders so orders can be assigned for delivery."
        />
      )}

      {!loading && riders.length > 0 && (
        <div className="overflow-x-auto ticket-card shadow-card">
          <table className="table w-full">
            <thead>
              <tr className="text-xs uppercase text-ink/50 border-b border-sand">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-left">Vehicle</th>
                <th className="py-3 px-4 text-left">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {riders.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-sand/60 last:border-none"
                >
                  <td className="py-3 px-4 font-medium text-ink">
                    {r.name}
                  </td>

                  <td className="py-3 px-4 text-ink/60">
                    <div>{r.email}</div>
                    <div className="text-xs">{r.phone}</div>
                  </td>

                  <td className="py-3 px-4 text-ink/60 capitalize">
                    {r.vehicle_type} · {r.vehicle_number}
                  </td>

                  <td className="py-3 px-4">
                    <span
                      className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        r.is_available
                          ? 'bg-basil/10 text-basil'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {r.is_available ? 'Available' : 'Busy'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setDeleteTarget(r)}
                      className="btn btn-sm btn-ghost text-chili focus-ring"
                      aria-label="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Remove this rider?"
        size="sm"
      >
        <p className="text-sm text-ink/60">
          "{deleteTarget?.name}" will no longer be assignable to orders.
        </p>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setDeleteTarget(null)}
            className="btn btn-ghost flex-1 rounded-xl focus-ring"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="btn bg-chili hover:bg-chili-dark text-white border-none flex-1 rounded-xl focus-ring"
          >
            {deleting ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </Modal>
    </div>
  )
}