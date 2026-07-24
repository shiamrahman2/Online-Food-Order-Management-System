import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Store, Pencil, Trash2 } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    adminService
      .getRestaurants()
      .then((res) => setRestaurants(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await adminService.deleteRestaurant(deleteTarget.id)
      toast.success('Restaurant deleted')
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
        <h1 className="font-display text-3xl font-bold text-ink">Restaurants</h1>
        <Link to="/admin/restaurants/create" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring">
          <Plus size={16} /> Add restaurant
        </Link>
      </div>

      {loading && <Skeleton count={6} />}

      {!loading && restaurants.length === 0 && (
        <EmptyState icon={Store} title="No restaurants yet" message="Onboard your first restaurant partner." />
      )}

      {!loading && restaurants.length > 0 && (
        <div className="overflow-x-auto ticket-card shadow-card">
          <table className="table w-full">
            <thead>
              <tr className="text-xs uppercase text-ink/50 border-b border-sand">
                <th className="py-3 px-4 text-left">Restaurant</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((r) => (
                <tr key={r.id} className="border-b border-sand/60 last:border-none">
                  <td className="py-3 px-4 font-medium text-ink">{r.name}</td>
                  <td className="py-3 px-4 text-ink/60">{r.email}</td>
                  <td className="py-3 px-4 text-ink/60">{r.phone}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.is_active ? 'bg-basil/10 text-basil' : 'bg-gray-100 text-gray-500'}`}>
                      {r.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => navigate(`/admin/restaurants/${r.id}/edit`)} className="btn btn-sm btn-ghost focus-ring" aria-label="Edit"><Pencil size={15} /></button>
                      <button onClick={() => setDeleteTarget(r)} className="btn btn-sm btn-ghost text-chili focus-ring" aria-label="Delete"><Trash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this restaurant?" size="sm">
        <p className="text-sm text-ink/60">"{deleteTarget?.name}" and its menu will be removed. This can't be undone.</p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost flex-1 rounded-xl focus-ring">Cancel</button>
          <button onClick={handleDelete} disabled={deleting} className="btn bg-chili hover:bg-chili-dark text-white border-none flex-1 rounded-xl focus-ring">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
