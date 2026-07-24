import { Link } from 'react-router-dom'
import { UtensilsCrossed } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream px-4 text-center">
      <span className="w-16 h-16 rounded-full bg-hero-gradient flex items-center justify-center text-white mb-6">
        <UtensilsCrossed size={28} />
      </span>
      <h1 className="font-display text-6xl font-bold text-ink">404</h1>
      <p className="text-ink/60 mt-2 max-w-sm">
        This plate's empty. The page you're looking for doesn't exist.
      </p>
      <Link to="/home" className="btn bg-mango hover:bg-mango-dark text-white border-none rounded-full mt-6 focus-ring">
        Back to FoodHub
      </Link>
    </div>
  )
}
