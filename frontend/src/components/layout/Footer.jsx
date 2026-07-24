import { Link } from 'react-router-dom'
import { UtensilsCrossed, Facebook, Instagram, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-ink text-cream/80 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-display font-bold text-xl text-cream mb-3">
            <span className="w-9 h-9 rounded-full bg-hero-gradient flex items-center justify-center text-white">
              <UtensilsCrossed size={18} />
            </span>
            FoodHub
          </div>
          <p className="text-sm text-cream/60">Local kitchens, delivered fast — order food you'll crave.</p>
          <div className="flex gap-3 mt-4">
            <Facebook size={18} className="hover:text-mango cursor-pointer" />
            <Instagram size={18} className="hover:text-mango cursor-pointer" />
            <Twitter size={18} className="hover:text-mango cursor-pointer" />
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/home" className="hover:text-mango">Home</Link></li>
            <li><Link to="/search" className="hover:text-mango">Browse restaurants</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">Get started</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/register" className="hover:text-mango">Create an account</Link></li>
            <li><Link to="/login" className="hover:text-mango">Log in</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-cream mb-3 text-sm uppercase tracking-wide">Partner with us</h4>
          <p className="text-sm text-cream/60">Restaurant and delivery accounts are created by our admin team.</p>
        </div>
      </div>
      <div className="border-t border-cream/10 py-4 text-center text-xs text-cream/40">
        © {new Date().getFullYear()} FoodHub. All rights reserved.
      </div>
    </footer>
  )
}
