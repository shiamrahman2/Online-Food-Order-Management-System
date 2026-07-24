import { NavLink, useNavigate, Link } from 'react-router-dom'
import { LogOut, UtensilsCrossed } from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Sidebar({ title, links }) {
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="w-full md:w-64 shrink-0 bg-ink text-cream md:min-h-screen flex md:flex-col">
      <div className="p-5 border-b border-white/10 hidden md:block">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="w-8 h-8 rounded-full bg-hero-gradient flex items-center justify-center text-white">
            <UtensilsCrossed size={15} />
          </span>
          FoodHub
        </Link>
        <p className="text-xs text-cream/50 mt-1 uppercase tracking-wide">{title}</p>
      </div>

      <nav className="flex md:flex-col gap-1 p-3 overflow-x-auto md:overflow-visible flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                isActive ? 'bg-mango text-white' : 'text-cream/70 hover:bg-white/10'
              }`
            }
          >
            <link.icon size={17} />
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 hidden md:block">
        <p className="text-xs text-cream/50 px-2 mb-2 truncate">{user?.name}</p>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-cream/70 hover:bg-chili/20 hover:text-chili w-full transition-colors"
        >
          <LogOut size={17} /> Logout
        </button>
      </div>
    </aside>
  )
}
