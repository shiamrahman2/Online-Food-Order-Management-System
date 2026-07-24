import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import menuService from '../../services/menuService.js'
import Loading from '../../components/common/Loading.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

const CATEGORY_OPTIONS = ['Pizza', 'Burger', 'Rice', 'Noodles', 'Salad', 'Soup', 'Dessert', 'Beverage', 'Seafood', 'Grill', 'Other']

export default function EditMenu() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    menuService
      .getMyMenu()
      .then((res) => {
        const item = (res.data.data || []).find((m) => String(m.id) === String(id))
        if (!item) {
          toast.error('Menu item not found')
          navigate('/restaurant/menu')
          return
        }
        setForm(item)
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await menuService.updateMenu(id, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        image: form.image,
        is_available: form.is_available,
      })
      toast.success('Menu item updated')
      navigate('/restaurant/menu')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <Loading fullScreen label="Loading item..." />

  return (
    <div className="max-w-xl">
      <Link to="/restaurant/menu" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to menu
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Edit menu item</h1>

      <form onSubmit={handleSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Item name</label>
          <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Description</label>
          <textarea required value={form.description} onChange={update('description')} rows={3} className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Price (৳)</label>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={update('price')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Category</label>
            <select value={form.category} onChange={update('category')} className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring">
              {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Image URL</label>
          <input value={form.image} onChange={update('image')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-ink/70">
          <input type="checkbox" checked={form.is_available} onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))} className="checkbox checkbox-sm" />
          Available for order
        </label>
        <button type="submit" disabled={saving} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl w-full focus-ring">
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}
