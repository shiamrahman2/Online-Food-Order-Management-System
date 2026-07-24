import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { SearchX } from 'lucide-react'
import menuService from '../../services/menuService.js'
import restaurantService from '../../services/restaurantService.js'
import SearchBar from '../../components/common/SearchBar.jsx'
import FoodCard from '../../components/common/FoodCard.jsx'
import RestaurantCard from '../../components/common/RestaurantCard.jsx'
import Skeleton from '../../components/common/Skeleton.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { getErrorMessage } from '../../utils/helpers.js'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const initialQuery = params.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [foods, setFoods] = useState([])
  const [restaurants, setRestaurants] = useState([])
  const [allRestaurants, setAllRestaurants] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    restaurantService.getAllRestaurants().then((res) => setAllRestaurants(res.data.data || [])).catch(() => {})
  }, [])

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery])

  const runSearch = async (q) => {
    setParams(q ? { q } : {})
    if (!q) {
      setFoods([])
      setRestaurants([])
      setSearched(false)
      return
    }
    setLoading(true)
    setSearched(true)
    try {
      const res = await menuService.searchFood(q)
      setFoods(res.data.data || [])
      setRestaurants(
        allRestaurants.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()))
      )
    } catch (err) {
      setFoods([])
      import('react-hot-toast').then(({ default: toast }) => toast.error(getErrorMessage(err)))
    } finally {
      setLoading(false)
    }
  }

  const restaurantNameFor = (restaurantId) =>
    allRestaurants.find((r) => r.id === restaurantId)?.name

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink mb-6">Find your craving</h1>
      <SearchBar value={query} onChange={setQuery} onSubmit={runSearch} />

      <div className="mt-10">
        {loading && <Skeleton count={8} />}

        {!loading && !searched && (
          <EmptyState
            icon={SearchX}
            title="Search for restaurants and food"
            message="Try 'pizza', 'burger', or the name of a restaurant you love."
          />
        )}

        {!loading && searched && restaurants.length === 0 && foods.length === 0 && (
          <EmptyState icon={SearchX} title="No results" message={`We couldn't find anything for "${query}". Try a different search.`} />
        )}

        {!loading && restaurants.length > 0 && (
          <div className="mb-10">
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Restaurants</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {restaurants.map((r) => (
                <RestaurantCard key={r.id} restaurant={r} />
              ))}
            </div>
          </div>
        )}

        {!loading && foods.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold text-ink mb-4">Food</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {foods.map((item) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  restaurantName={restaurantNameFor(item.restaurant_id)}
                  onAdd={() =>
                    addItem(
                      { id: item.restaurant_id, name: restaurantNameFor(item.restaurant_id) || 'Restaurant' },
                      item
                    )
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
