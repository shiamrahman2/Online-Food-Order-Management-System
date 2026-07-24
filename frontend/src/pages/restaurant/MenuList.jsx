import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, UtensilsCrossed } from 'lucide-react'
import menuService from '../../services/menuService.js'
import MenuCard from '../../components/common/MenuCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Modal from '../../components/common/Modal.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function MenuList() {
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const load = () => {
    setLoading(true)
    menuService
      .getMyMenu()
      .then((res) => setMenu(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await menuService.deleteMenu(deleteTarget.id)
      toast.success('Menu item deleted')
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
        <h1 className="font-display text-3xl font-bold text-ink">Your menu</h1>
        <Link to="/restaurant/menu/create" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring">
          <Plus size={16} /> Add item
        </Link>
      </div>

      {loading && <Skeleton count={6} />}

      {!loading && menu.length === 0 && (
        <EmptyState
          icon={UtensilsCrossed}
          title="No menu items yet"
          message="Add your first dish so customers can start ordering."
          action={
            <Link to="/restaurant/menu/create" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring">
              <Plus size={16} /> Add item
            </Link>
          }
        />
      )}

      {!loading && menu.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {menu.map((item) => (
            <MenuCard
              key={item.id}
              item={item}
              onEdit={(i) => navigate(`/restaurant/menu/${i.id}/edit`)}
              onDelete={(i) => setDeleteTarget(i)}
            />
          ))}
        </div>
      )}

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Delete this item?" size="sm">
        <p className="text-sm text-ink/60">
          "{deleteTarget?.name}" will be removed from your menu. This can't be undone.
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={() => setDeleteTarget(null)} className="btn btn-ghost flex-1 rounded-xl focus-ring">
            Cancel
          </button>
          <button onClick={handleDelete} disabled={deleting} className="btn bg-chili hover:bg-chili-dark text-white border-none flex-1 rounded-xl focus-ring">
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </Modal>
    </div>
  )
}
