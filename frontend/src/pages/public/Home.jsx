import { useEffect, useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import { Pizza, Salad, Soup, UtensilsCrossed, IceCreamCone, Beef, Fish, Search as SearchIcon } from 'lucide-react'
import restaurantService from '../../services/restaurantService.js'
import RestaurantCard from '../../components/common/RestaurantCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import SearchBar from '../../components/common/SearchBar.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

const CATEGORIES = [
  { label: 'Pizza', icon: Pizza },
  { label: 'Salads', icon: Salad },
  { label: 'Soups', icon: Soup },
  { label: 'Dessert', icon: IceCreamCone },
  { label: 'Grill', icon: Beef },
  { label: 'Seafood', icon: Fish },
  {label: 'Noodles',icon:UtensilsCrossed},
]

export default function Home() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    restaurantService
      .getAllRestaurants()
      .then((res) => {
        if (mounted) setRestaurants(res.data.data || [])
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  const handleSearch = (q) => {
    navigate(`/search${q ? `?q=${encodeURIComponent(q)}` : ''}`)
  }

  return (
    <div>
      {/* Hero */}
      {/* <section className="relative bg-hero-gradient overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 relative z-10">
          <p className="uppercase tracking-[0.2em] text-white/80 text-xs font-semibold mb-4">Delivered hot, fast, fresh</p>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white max-w-2xl leading-[1.05]">
            The neighborhood kitchen, on your doorstep tonight.
          </h1>
          <p className="text-white/85 mt-4 max-w-lg text-lg">
            Order from real restaurants near you — no shortcuts, no ghost kitchens, just the food you're craving.
          </p>
          <div className="mt-8">
            <SearchBar value={query} onChange={setQuery} onSubmit={handleSearch} placeholder="Search 'biryani', 'pizza', 'burger'..." />
          </div>
        </div>
        <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full bg-white/10 hidden lg:block" />
        <div className="absolute top-10 right-32 w-24 h-24 rounded-full bg-white/10 hidden lg:block" />
      </section> */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-red-500">

  {/* Background Decorations */}
  <div className="absolute -top-32 -left-32 w-96 h-96 bg-yellow-300/20 rounded-full blur-3xl"></div>
  <div className="absolute -bottom-32 right-0 w-[500px] h-[500px] bg-red-300/20 rounded-full blur-3xl"></div>
  <div className="absolute top-20 right-1/3 w-24 h-24 bg-white/10 rounded-full"></div>
  <div className="absolute bottom-20 left-1/3 w-16 h-16 bg-white/10 rounded-full"></div>

  <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-28">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* Left Side */}
      <div>

        <p className="uppercase tracking-[0.25em] text-white/80 text-sm font-semibold mb-4">
          Delivered Hot • Fresh • Fast
        </p>

        <h1 className="font-display text-5xl lg:text-7xl font-bold leading-tight text-white">
          Delicious Food
          <br />
          Delivered To
          <span className="block text-yellow-200">
            Your Doorstep
          </span>
        </h1>

        <p className="mt-6 text-lg text-white/90 max-w-xl leading-8">
          Discover the best restaurants around you. Order your favourite
          meals and enjoy lightning-fast delivery at the best prices.
        </p>

        <div className="mt-8 max-w-xl">
          <SearchBar
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch}
            placeholder="Search pizza, burger, biryani..."
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
  to="/search"
  className="btn bg-white hover:bg-gray-100 text-orange-500 border-none rounded-full px-8 shadow-xl"
>
  Order Now
</Link>
          {/* <button  className="btn btn-outline border-white text-white hover:bg-white hover:text-orange-500 rounded-full px-8">
            View Restaurants
          </button> */}

        </div>

      </div>

      {/* Right Side */}
      <div className="hidden lg:flex justify-center items-center relative">

        {/* Glow */}
        <div className="absolute w-[430px] h-[430px] rounded-full bg-white/15 blur-3xl"></div>

        {/* Decorative Dots */}
        <div className="absolute top-8 left-8 w-5 h-5 rounded-full bg-yellow-300"></div>
        <div className="absolute top-20 right-12 w-3 h-3 rounded-full bg-white"></div>
        <div className="absolute bottom-10 left-16 w-4 h-4 rounded-full bg-red-300"></div>

        {/* Main Image */}
        <img
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900"
          alt="Pizza"
          className="relative z-10 w-[420px] rounded-[40px] shadow-2xl hover:scale-105 hover:-rotate-2 transition-all duration-500"
        />

        {/* Rating Card */}
        <div className="absolute top-6 -left-10 bg-white/95 backdrop-blur rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-2xl">
            ⭐
          </div>

          <div>
            <p className="font-bold text-gray-800">
              4.9 Rating
            </p>

            <p className="text-xs text-gray-500">
              2,500+ Reviews
            </p>
          </div>

        </div>

        {/* Delivery Card */}
        <div className="absolute bottom-5 -right-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl px-5 py-4 flex items-center gap-3">

          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-2xl">
            🛵
          </div>

          <div>

            <p className="font-bold text-gray-800">
              20-30 Min
            </p>

            <p className="text-xs text-gray-500">
              Fast Delivery
            </p>

          </div>

        </div>

        {/* Restaurants Card */}
        <div className="absolute bottom-32 -left-8 bg-white/95 backdrop-blur rounded-2xl shadow-xl px-5 py-4">

          <p className="text-2xl">
            🍔
          </p>

          <p className="font-bold text-gray-800 mt-2">
            500+
          </p>

          <p className="text-xs text-gray-500">
            Restaurants
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-display text-2xl font-semibold text-ink mb-6">Craving something specific?</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((c) => (
            <button
              key={c.label}
              onClick={() => navigate(`/search?q=${encodeURIComponent(c.label)}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-card hover:shadow-soft hover:-translate-y-1 transition-all focus-ring"
            >
              <span className="w-12 h-12 rounded-full bg-sand flex items-center justify-center text-chili">
                <c.icon size={22} />
              </span>
              <span className="text-sm font-medium text-ink/80">{c.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-semibold text-ink">Popular near you</h2>
        </div>

        {loading && <Skeleton count={8} />}

        {!loading && error && (
          <EmptyState icon={SearchIcon} title="Couldn't load restaurants" message={error} />
        )}

        {!loading && !error && restaurants.length === 0 && (
          <EmptyState title="No restaurants yet" message="Check back soon — new kitchens are joining FoodHub all the time." />
        )}

        {!loading && !error && restaurants.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {restaurants.map((r) => (
              <RestaurantCard key={r.id} restaurant={r} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
