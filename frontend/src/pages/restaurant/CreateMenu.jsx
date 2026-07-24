import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import menuService from '../../services/menuService.js'
import { getErrorMessage } from '../../utils/helpers.js'

const CATEGORY_OPTIONS = ['Pizza', 'Burger', 'Rice', 'Noodles', 'Salad', 'Soup', 'Dessert', 'Beverage', 'Seafood', 'Grill', 'Other']

export default function CreateMenu() {
  const [form, setForm] = useState({ name: '', description: '', price: '', category: 'Pizza', image: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await menuService.createMenu({ ...form, price: Number(form.price) })
      toast.success('Menu item created')
      navigate('/restaurant/menu')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Link to="/restaurant/menu" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to menu
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Add a menu item</h1>

      <form onSubmit={handleSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Item name</label>
          <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="BBQ Chicken Pizza" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Description</label>
          <textarea required value={form.description} onChange={update('description')} rows={3} className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="Grilled chicken with BBQ sauce and mozzarella" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Price (৳)</label>
            <input required type="number" min="0" step="0.01" value={form.price} onChange={update('price')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="450.00" />
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
          <input value={form.image} onChange={update('image')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="https://example.com/dish.jpg" />
        </div>
        <button type="submit" disabled={saving} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl w-full focus-ring">
          {saving ? 'Creating...' : 'Create item'}
        </button>
      </form>
    </div>
  )
}
