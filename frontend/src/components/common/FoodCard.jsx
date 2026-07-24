 import { Plus, UtensilsCrossed } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { formatCurrency } from '../../utils/helpers'

export default function FoodCard({ item, onAdd, restaurantName }) {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()

  const handleAdd = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    onAdd(item)
  }

  return (
    <div className="ticket-card shadow-card hover:shadow-soft transition-shadow duration-200">
      <div className="h-32 bg-sand relative overflow-hidden">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mango-dark">
            <UtensilsCrossed size={28} />
          </div>
        )}

        {!item.is_available && (
          <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
            <span className="text-white text-xs font-bold uppercase tracking-wide">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-chili font-semibold">
          {item.category}
        </p>

        <h4 className="font-display font-semibold text-ink mt-0.5">
          {item.name}
        </h4>

        {restaurantName && (
          <p className="text-xs text-ink/50 mt-0.5">{restaurantName}</p>
        )}

        <p className="text-sm text-ink/60 mt-1 line-clamp-2 min-h-[2.5rem]">
          {item.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="price-tag text-mango-dark font-bold text-lg">
            {formatCurrency(item.price)}
          </span>

          <button
            disabled={!item.is_available}
            onClick={handleAdd}
            className="btn btn-sm bg-mango hover:bg-mango-dark disabled:bg-sand disabled:text-ink/30 text-white border-none rounded-full focus-ring"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  )
}