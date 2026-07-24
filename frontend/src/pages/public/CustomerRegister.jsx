import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function CustomerRegister() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' })
  const [showPassword, setShowPassword] = useState(false)
  const { registerCustomer, loading } = useAuth()
  const navigate = useNavigate()

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await registerCustomer(form)
    if (success) navigate('/login')
  }

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-soft w-full max-w-md p-8">
        <Link to="/home" className="flex items-center gap-2 font-display font-bold text-xl text-ink justify-center mb-6">
          <span className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-white">
            <UtensilsCrossed size={18} />
          </span>
          FoodHub
        </Link>
        <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">Create your account</h1>
        <p className="text-center text-sm text-ink/50 mb-6">Order from your favorite local kitchens</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Full name</label>
            <input required value={form.name} onChange={update('name')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="Alice Johnson" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input type="email" required value={form.email} onChange={update('email')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="you@example.com" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Phone</label>
            <input required value={form.phone} onChange={update('phone')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="01700000000" />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Delivery address</label>
            <input required value={form.address} onChange={update('address')} className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring" placeholder="789 Pine Road, Residential Area" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <div className="relative mt-1">
              <input 
                type={showPassword ? 'text' : 'password'} 
                required 
                value={form.password} 
                onChange={update('password')} 
                className="input w-full bg-cream border-sand focus:border-mango rounded-xl focus-ring pr-10" 
                placeholder="••••••••" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/50 hover:text-ink/80 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-2 focus-ring">
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-ink/60 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-mango-dark font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}