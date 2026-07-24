import { Pencil, Trash2, UtensilsCrossed } from 'lucide-react'
import { formatCurrency } from '../../utils/helpers'

export default function MenuCard({ item, onEdit, onDelete }) {
  return (
    <div className="ticket-card shadow-card">
      <div className="h-28 bg-sand relative overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-mango-dark">
            <UtensilsCrossed size={26} />
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
            item.is_available ? 'bg-basil text-white' : 'bg-ink/70 text-white'
          }`}
        >
          {item.is_available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-chili font-semibold">{item.category}</p>
        <h4 className="font-display font-semibold text-ink mt-0.5">{item.name}</h4>
        <p className="text-sm text-ink/60 mt-1 line-clamp-2 min-h-[2.5rem]">{item.description}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="price-tag text-mango-dark font-bold text-lg">{formatCurrency(item.price)}</span>
          <div className="flex gap-2">
            <button onClick={() => onEdit(item)} className="btn btn-sm btn-ghost focus-ring" aria-label="Edit">
              <Pencil size={16} />
            </button>
            <button onClick={() => onDelete(item)} className="btn btn-sm btn-ghost text-chili focus-ring" aria-label="Delete">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
