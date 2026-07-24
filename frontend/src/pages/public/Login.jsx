import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, UtensilsCrossed, User, ShieldCheck, Store, Bike } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { ROLES, ROLE_HOME } from '../../utils/constants.js'

const TABS = [
  { key: ROLES.CUSTOMER, label: 'Customer', icon: User },
  { key: ROLES.RESTAURANT, label: 'Restaurant', icon: Store },
  { key: ROLES.DELIVERY, label: 'Delivery', icon: Bike },
  { key: ROLES.ADMIN, label: 'Admin', icon: ShieldCheck },
]

export default function Login() {
  const [tab, setTab] = useState(ROLES.CUSTOMER)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loginCustomer, loginAdmin, loginRestaurant, loginDelivery, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const credentials = { email, password }
    let success = false
    if (tab === ROLES.CUSTOMER) success = await loginCustomer(credentials)
    if (tab === ROLES.ADMIN) success = await loginAdmin(credentials)
    if (tab === ROLES.RESTAURANT) success = await loginRestaurant(credentials)
    if (tab === ROLES.DELIVERY) success = await loginDelivery(credentials)

    if (success) {
      const redirectTo = location.state?.from?.pathname || ROLE_HOME[tab]
      navigate(redirectTo, { replace: true })
    }
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

        <div className="grid grid-cols-4 gap-1 bg-sand rounded-full p-1 mb-6">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex flex-col items-center gap-0.5 py-2 rounded-full text-[11px] font-semibold transition-colors ${
                tab === t.key ? 'bg-mango text-white' : 'text-ink/50 hover:text-ink'
              }`}
            >
              <t.icon size={15} />
              {t.label}
            </button>
          ))}
        </div>

        <h1 className="font-display text-2xl font-bold text-ink text-center mb-1">Welcome back</h1>
        <p className="text-center text-sm text-ink/50 mb-6">Log in as {TABS.find((t) => t.key === tab).label.toLowerCase()}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full bg-cream border-sand focus:border-mango rounded-xl pr-10 focus-ring"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-2 focus-ring"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {tab === ROLES.CUSTOMER && (
          <p className="text-center text-sm text-ink/60 mt-6">
            New to FoodHub?{' '}
            <Link to="/register" className="text-mango-dark font-semibold hover:underline">
              Create an account
            </Link>
          </p>
        )}
        {tab === ROLES.ADMIN && (
          <p className="text-center text-sm text-ink/60 mt-6">
            First time setup?{' '}
            <Link to="/admin/register" className="text-mango-dark font-semibold hover:underline">
              Register admin
            </Link>
          </p>
        )}
        {(tab === ROLES.RESTAURANT || tab === ROLES.DELIVERY) && (
          <p className="text-center text-xs text-ink/40 mt-6">
            {tab === ROLES.RESTAURANT ? 'Restaurant' : 'Delivery'} accounts are created by an admin. Contact support if you need access.
          </p>
        )}
      </div>
    </div>
  )
}
