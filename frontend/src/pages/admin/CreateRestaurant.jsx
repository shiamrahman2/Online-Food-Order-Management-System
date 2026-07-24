import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import adminService from '../../services/adminService.js'
import { getErrorMessage } from '../../utils/helpers.js'

export default function CreateRestaurant() {
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '', email: '', password: '', logo: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.createRestaurant(form)
      toast.success('Restaurant created')
      navigate('/admin/restaurants')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Link to="/admin/restaurants" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to restaurants
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Add a restaurant</h1>

      <form onSubmit={handleSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Restaurant name</label>
          <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="Pizza Palace" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Description</label>
          <textarea required value={form.description} onChange={update('description')} rows={2} className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Address</label>
          <input required value={form.address} onChange={update('address')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Phone</label>
            <input required value={form.phone} onChange={update('phone')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input required type="email" value={form.email} onChange={update('email')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Login password</label>
          <input required type="password" value={form.password} onChange={update('password')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Logo URL</label>
          <input value={form.logo} onChange={update('logo')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="https://..." />
        </div>
        <button type="submit" disabled={saving} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl w-full focus-ring">
          {saving ? 'Creating...' : 'Create restaurant'}
        </button>
      </form>
    </div>
  )
}
