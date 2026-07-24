import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldCheck } from 'lucide-react'
import authService from '../../services/authService.js'
import { getErrorMessage } from '../../utils/helpers.js'

export default function AdminRegister() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await authService.adminRegister(form)
      toast.success('Admin registered. Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-soft w-full max-w-md p-8">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-ink justify-center mb-6">
          <span className="w-9 h-9 rounded-full bg-ink flex items-center justify-center text-white">
            <ShieldCheck size={18} />
          </span>
          Admin setup
        </div>
        <p className="text-center text-sm text-ink/50 mb-6">This can only be done once, for the first admin account.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Full name</label>
            <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="Super Admin" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input type="email" required value={form.email} onChange={update('email')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="admin@foodorder.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Phone</label>
            <input required value={form.phone} onChange={update('phone')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="+8801700000001" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input type="password" required value={form.password} onChange={update('password')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="••••••••" />
          </div>

          <button type="submit" disabled={loading} className="btn w-full bg-ink hover:bg-plum text-white border-none rounded-xl mt-2 focus-ring">
            {loading ? 'Registering...' : 'Register admin'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          <Link to="/login" className="text-mango-dark font-semibold hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
