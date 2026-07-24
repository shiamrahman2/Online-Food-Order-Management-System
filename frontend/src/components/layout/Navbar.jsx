import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  ShoppingCart,
  MapPin,
  UtensilsCrossed,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { ROLES } from '../../utils/constants'

export default function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur border-b border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/home"
          className="flex items-center gap-2 font-display font-bold text-2xl text-ink"
        >
          <span className="w-10 h-10 rounded-full bg-hero-gradient flex items-center justify-center text-white shadow-md">
            <UtensilsCrossed size={20} />
          </span>

          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            FoodHub
          </span>
        </Link>

        {/* Location */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-gray-600">
          <MapPin size={16} className="text-red-500" />
          <span>Chattogram, Bangladesh</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 ml-auto">
          <Link to="/home"
           className="font-medium text-gray-700 hover:text-orange-500 transition"
           >
            Home
           </Link>
             
          <Link
            to="/search"
            className="font-medium text-gray-700 hover:text-orange-500 transition"
          >
            Browse
          </Link>

          {/* Cart */}
          {isAuthenticated && role === ROLES.CUSTOMER && (
            <Link
              to="/cart"
              className="relative p-2 rounded-full hover:bg-orange-50 transition"
            >
              <ShoppingCart
                size={22}
                className="text-gray-700 hover:text-orange-500"
              />

              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-3">

              {/* Notification */}
              {/* <button className="relative p-2 rounded-full hover:bg-orange-50 transition">
                <Bell size={21} className="text-gray-700" />

                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button> */}

              {/* Profile */}
              <div className="dropdown dropdown-end">
                <button
                  tabIndex={0}
                  className="flex items-center gap-3 bg-white rounded-full pl-2 pr-4 py-1.5 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <img
                    src={
                      user?.image ||
                      `https://ui-avatars.com/api/?name=${
                        user?.name || 'User'
                      }&background=ff8c42&color=fff`
                    }
                    alt="Profile"
                    className="w-11 h-11 rounded-full object-cover border-2 border-orange-400"
                  />

                  <div className="hidden lg:block text-left">
                    <p className="font-semibold text-sm text-gray-800">
                      {user?.name?.split(' ')[0] || 'Account'}
                    </p>

                    <p className="text-xs text-gray-500 capitalize">
                      {role}
                    </p>
                  </div>
                </button>

                <ul
                  tabIndex={0}
                  className="dropdown-content mt-3 z-[100] menu p-2 shadow-xl bg-white rounded-2xl w-56 border"
                >
                  <li>
                    <Link to={dashboardPathFor(role)}>
                      Dashboard
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">

              <Link
                to="/login"
                className="btn btn-ghost btn-sm rounded-full"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-sm rounded-full bg-orange-500 hover:bg-orange-600 text-white border-none px-6"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t bg-white px-5 py-4 space-y-3">
          <Link
           to="/home"
            onClick={() => setOpen(false)}
           className="block"
          >
            Home
         </Link>
          <Link
            to="/search"
            onClick={() => setOpen(false)}
            className="block"
          >
            Browse
          </Link>

          {isAuthenticated &&
            role === ROLES.CUSTOMER && (
              <Link
                to="/cart"
                onClick={() => setOpen(false)}
                className="block"
              >
                Cart ({itemCount})
              </Link>
            )}

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardPathFor(role)}
                onClick={() => setOpen(false)}
                className="block"
              >
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-3">

              <Link
                to="/login"
                className="btn btn-sm btn-outline flex-1"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>

              <Link
                to="/register"
                className="btn btn-sm bg-orange-500 border-none text-white flex-1"
                onClick={() => setOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}

function dashboardPathFor(role) {
  switch (role) {
    case ROLES.ADMIN:
      return '/admin/dashboard'

    case ROLES.RESTAURANT:
      return '/restaurant/dashboard'

    case ROLES.DELIVERY:
      return '/delivery/dashboard'

    default:
      return '/customer/dashboard'
  }
}