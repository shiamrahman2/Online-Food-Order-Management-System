import { Link } from 'react-router-dom'
import { Store, MapPin, ArrowUpRight } from 'lucide-react'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="ticket-card shadow-card hover:shadow-soft hover:-translate-y-1 transition-all duration-200 group focus-ring"
    >
      <div className="h-36 bg-sand relative overflow-hidden">
        {restaurant.logo ? (
          <img
            src={restaurant.logo}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mango-dark">
            <Store size={36} />
          </div>
        )}
        {!restaurant.is_active && (
          <span className="absolute top-2 left-2 bg-chili text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">
            Closed
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display font-semibold text-ink text-lg leading-tight">{restaurant.name}</h3>
          <ArrowUpRight className="text-mango shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" size={18} />
        </div>
        <p className="text-sm text-ink/60 mt-1 line-clamp-2">{restaurant.description}</p>
        <div className="flex items-center gap-1 mt-3 text-xs text-ink/50">
          <MapPin size={13} />
          <span className="truncate">{restaurant.address}</span>
        </div>
      </div>
    </Link>
  )
}
