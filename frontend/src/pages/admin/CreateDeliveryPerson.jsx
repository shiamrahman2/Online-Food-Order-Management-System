import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'
import adminService from '../../services/adminService.js'
import { getErrorMessage } from '../../utils/helpers.js'

const VEHICLE_TYPES = ['motorcycle', 'bicycle', 'car', 'van']

export default function CreateDeliveryPerson() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', vehicle_type: 'motorcycle', vehicle_number: '' })
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await adminService.createDeliveryPerson(form)
      toast.success('Delivery person created')
      navigate('/admin/delivery-persons')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <Link to="/admin/delivery-persons" className="inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink mb-4">
        <ArrowLeft size={15} /> Back to delivery persons
      </Link>
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Add a delivery rider</h1>

      <form onSubmit={handleSubmit} className="ticket-card shadow-card p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Full name</label>
          <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="John Rider" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input required type="email" value={form.email} onChange={update('email')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Phone</label>
            <input required value={form.phone} onChange={update('phone')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Login password</label>
          <input required type="password" value={form.password} onChange={update('password')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Vehicle type</label>
            <select value={form.vehicle_type} onChange={update('vehicle_type')} className="select w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring">
              {VEHICLE_TYPES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Vehicle number</label>
            <input required value={form.vehicle_number} onChange={update('vehicle_number')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="DHA-12345" />
          </div>
        </div>
        <button type="submit" disabled={saving} className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-xl w-full focus-ring">
          {saving ? 'Creating...' : 'Create rider'}
        </button>
      </form>
    </div>
  )
}
