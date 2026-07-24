import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { formatCurrency } from '../../utils/helpers.js'

export default function Cart() {
  const { cart, updateQuantity, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          message="Browse restaurants and add something delicious."
          action={
            <Link to="/search" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full focus-ring">
              Browse food
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">Your cart</h1>
      <p className="text-ink/60 mt-1">Ordering from <span className="font-semibold text-ink">{cart.restaurantName}</span></p>

      <div className="ticket-card shadow-card mt-6 divide-y divide-sand">
        {cart.items.map((item) => (
          <div key={item.menu_id} className="flex items-center gap-4 p-4">
            <div className="w-16 h-16 rounded-xl bg-sand shrink-0 overflow-hidden">
              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-ink truncate">{item.name}</p>
              <p className="price-tag text-mango-dark font-bold">{formatCurrency(item.price)}</p>
            </div>
            <div className="flex items-center gap-2 bg-cream rounded-full border border-sand px-2 py-1">
              <button onClick={() => updateQuantity(item.menu_id, item.quantity - 1)} className="p-1 hover:text-chili" aria-label="Decrease quantity"><Minus size={14} /></button>
              <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.menu_id, item.quantity + 1)} className="p-1 hover:text-basil" aria-label="Increase quantity"><Plus size={14} /></button>
            </div>
            <button onClick={() => removeItem(item.menu_id)} className="text-ink/30 hover:text-chili" aria-label="Remove item">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="ticket-card shadow-card mt-6 p-5">
        <div className="flex items-center justify-between text-lg">
          <span className="font-semibold text-ink">Subtotal</span>
          <span className="price-tag font-bold text-mango-dark">{formatCurrency(total)}</span>
        </div>
        <p className="text-xs text-ink/50 mt-1">Delivery fee and taxes calculated at checkout.</p>
        <button
          onClick={() => navigate('/checkout')}
          className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-4 focus-ring"
        >
          Proceed to checkout <ArrowRight size={16} />
        </button>
      </div>
    </div>
  )
}
