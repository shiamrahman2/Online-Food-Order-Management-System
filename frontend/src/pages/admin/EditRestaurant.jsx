import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import adminService from '../../services/adminService.js'
import Loading from '../../components/common/Loading.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function EditRestaurant() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    adminService
      .getRestaurants()
      .then((res) => {
        const found = (res.data.data || []).find((r) => String(r.id) === String(id))
        if (!found) {
          toast.error('Restaurant not found')
          navigate('/admin/restaurants')
          return
        }
        setForm(found)
      })
      .catch((err) => toast.error(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.updateRestaurant(id, {
        name: form.name,
        email: form.email,
        description: form.description,
        address: form.address,
        phone: form.phone,
        logo: form.logo,
        is_active: form.is_active,
      })
      toast.success('Restaurant updated')
      navigate('/admin/restaurants')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading || !form) return <Loading fullScreen label="Loading restaurant..." />

  return (
    <div className="max-w-xl">
      <Link to="/admin/restaurants" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to restaurants
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Edit restaurant</h1>

      <form onSubmit={handleSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Restaurant name</label>
          <input
            required
            value={form.name || ''}
            onChange={update('name')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Email</label>
          <input
            type="email"
            required
            value={form.email || ''}
            onChange={update('email')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Description</label>
          <textarea
            required
            value={form.description || ''}
            onChange={update('description')}
            rows={2}
            className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Address</label>
          <input
            required
            value={form.address || ''}
            onChange={update('address')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Phone</label>
          <input
            required
            value={form.phone || ''}
            onChange={update('phone')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-ink/70">Logo URL</label>
          <input
            value={form.logo || ''}
            onChange={update('logo')}
            className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl w-full focus-ring"
        >
          {saving ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}