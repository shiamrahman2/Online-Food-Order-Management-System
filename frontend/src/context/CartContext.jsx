import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

const CartContext = createContext(null)
const CART_KEY = 'foodhub_cart'

function loadCart() {
  try {
    const raw = sessionStorage.getItem(CART_KEY)
    return raw ? JSON.parse(raw) : { restaurantId: null, restaurantName: null, items: [] }
  } catch {
    return { restaurantId: null, restaurantName: null, items: [] }
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart)

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addItem = useCallback((restaurant, menuItem) => {
    setCart((prev) => {
      // Switching restaurants clears the cart — orders belong to one restaurant.
      if (prev.restaurantId && prev.restaurantId !== restaurant.id) {
        toast('Started a new cart for this restaurant', { icon: '🛒' })
        return {
          restaurantId: restaurant.id,
          restaurantName: restaurant.name,
          items: [{ menu_id: menuItem.id, name: menuItem.name, price: menuItem.price, image: menuItem.image, quantity: 1 }],
        }
      }
      const existing = prev.items.find((i) => i.menu_id === menuItem.id)
      let items
      if (existing) {
        items = prev.items.map((i) =>
          i.menu_id === menuItem.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        items = [
          ...prev.items,
          { menu_id: menuItem.id, name: menuItem.name, price: menuItem.price, image: menuItem.image, quantity: 1 },
        ]
      }
      toast.success(`Added ${menuItem.name}`)
      return { restaurantId: restaurant.id, restaurantName: restaurant.name, items }
    })
  }, [])

  const updateQuantity = useCallback((menuId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) {
        const items = prev.items.filter((i) => i.menu_id !== menuId)
        return { ...prev, items, restaurantId: items.length ? prev.restaurantId : null, restaurantName: items.length ? prev.restaurantName : null }
      }
      return {
        ...prev,
        items: prev.items.map((i) => (i.menu_id === menuId ? { ...i, quantity } : i)),
      }
    })
  }, [])

  const removeItem = useCallback((menuId) => {
    setCart((prev) => {
      const items = prev.items.filter((i) => i.menu_id !== menuId)
      return {
        ...prev,
        items,
        restaurantId: items.length ? prev.restaurantId : null,
        restaurantName: items.length ? prev.restaurantName : null,
      }
    })
  }, [])

  const clearCart = useCallback(() => {
    setCart({ restaurantId: null, restaurantName: null, items: [] })
  }, [])

  const itemCount = cart.items.reduce((sum, i) => sum + i.quantity, 0)
  const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  const value = { cart, addItem, updateQuantity, removeItem, clearCart, itemCount, total }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
