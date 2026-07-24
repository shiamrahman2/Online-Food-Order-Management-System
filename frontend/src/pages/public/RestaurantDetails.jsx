import { useEffect, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Store, MapPin, Phone, ArrowLeft } from 'lucide-react'
import restaurantService from '../../services/restaurantService.js'
import FoodCard from '../../components/common/FoodCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import Loading from '../../components/common/Loading.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function RestaurantDetails() {
  const { id } = useParams()
  const { addItem } = useCart()
  const [restaurant, setRestaurant] = useState(null)
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([restaurantService.getAllRestaurants(), restaurantService.getRestaurantMenu(id)])
      .then(([restaurantsRes, menuRes]) => {
        if (!mounted) return
        const found = (restaurantsRes.data.data || []).find((r) => String(r.id) === String(id))
        setRestaurant(found || null)
        setMenu(menuRes.data.data || [])
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

  const categories = useMemo(() => {
    const set = new Set(menu.map((m) => m.category).filter(Boolean))
    return ['All', ...set]
  }, [menu])

  const filteredMenu = activeCategory === 'All' ? menu : menu.filter((m) => m.category === activeCategory)

  if (loading) return <Loading fullScreen label="Loading restaurant..." />

  if (error) {
    return <div className="max-w-3xl mx-auto py-16"><EmptyState title="Couldn't load this restaurant" message={error} /></div>
  }

  return (
    <div>
      <div className="bg-hero-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link to="/search" className="inline-flex items-center gap-1 text-white/80 text-sm mb-4 hover:text-white">
            <ArrowLeft size={15} /> Back to browsing
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden shrink-0">
              {restaurant?.logo ? (
                <img src={restaurant.logo} alt={restaurant.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none' }} />
              ) : (
                <Store className="text-white" size={30} />
              )}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white">{restaurant?.name || 'Restaurant'}</h1>
              <p className="text-white/80 mt-1 max-w-xl">{restaurant?.description}</p>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-white/80">
                {restaurant?.address && (
                  <span className="flex items-center gap-1"><MapPin size={14} /> {restaurant.address}</span>
                )}
                {restaurant?.phone && (
                  <span className="flex items-center gap-1"><Phone size={14} /> {restaurant.phone}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition-colors ${
                activeCategory === c ? 'bg-mango text-white border-mango' : 'bg-white text-ink/70 border-sand hover:border-mango'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {filteredMenu.length === 0 ? (
          <EmptyState title="No menu items" message="This restaurant hasn't added items in this category yet." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMenu.map((item) => (
              <FoodCard key={item.id} item={item} onAdd={() => addItem(restaurant || { id, name: 'Restaurant' }, item)} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
