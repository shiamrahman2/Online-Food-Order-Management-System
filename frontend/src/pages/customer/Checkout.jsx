import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaCcVisa, FaMoneyBillWave, FaWallet } from 'react-icons/fa'
import { useCart } from '../../context/CartContext.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import orderService from '../../services/orderService.js'
import paymentService from '../../services/paymentService.js'
import EmptyState from '../../components/common/EmptyState.jsx'
import { formatCurrency, getErrorMessage } from '../../utils/helpers.js'
const PAYMENT_METHODS = [
  {
    key: 'card',
    label: 'Card',
    icon: FaCcVisa,
  },
  {
    key: 'cash',
    label: 'Cash on delivery',
    icon: FaMoneyBillWave,
  },
  {
    key: 'bkash',
    label: 'bKash',
    icon: FaWallet,
  },
  {
    key: 'nagad',
    label: 'Nagad',
    icon: FaWallet,
  },
  {
    key: 'rocket',
    label: 'Rocket',
    icon: FaWallet,
  },
]
export default function Checkout() {
  const { cart, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [address, setAddress] = useState(user?.address || '')
  const [notes, setNotes] = useState('')
  const [method, setMethod] = useState('')
  const [placing, setPlacing] = useState(false)
  if (cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">

        <EmptyState
          title="Nothing to check out"
          message="Your cart is empty."
          action={
            <Link
              to="/search"
              className="btn bg-mango text-white border-none rounded-full"
            >
              Browse food
            </Link>
          }
        />

      </div>
    )
  }
  const handlePlaceOrder = async (e) => {
    e.preventDefault()
    if (!method) {
      toast.error('Please select a payment method')
      return
    }
    if (!address.trim()) {
      toast.error('Delivery address is required')
      return
    }
    setPlacing(true)
    try {
      const orderPayload = {
        restaurant_id: cart.restaurantId,
        delivery_address: address,
        notes,
        items: cart.items.map((i) => ({
          menu_id: i.menu_id,
          quantity: i.quantity,
        })),

        payment_method: method,

      }
      const orderRes = await orderService.createOrder(orderPayload)
      const order = orderRes.data.data
     try {
       await paymentService.createPayment({
          order_id: order.id,
          amount: order.total_amount,
          payment_method: method,
        })
      } catch (payErr) {
        toast.error(getErrorMessage(payErr))
      }
      clearCart()
      toast.success('Order placed!')
      navigate('/customer/orders')
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setPlacing(false)
    }

  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-display text-3xl font-bold text-ink">
        Checkout
      </h1>
      <form
        onSubmit={handlePlaceOrder}
        className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6"
      >
        <div className="md:col-span-3 space-y-6">
          <div className="ticket-card shadow-card p-5">
            <label className="text-sm font-medium text-ink/70">
              Delivery address
            </label>
            <textarea
             required
              value={address}
              onChange={(e)=>setAddress(e.target.value)}
              rows={2}
              className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"

            />
            <label className="text-sm font-medium text-ink/70 mt-4 block">
              Notes for the delivery person (optional)
            </label>
            <textarea
             value={notes}
              onChange={(e)=>setNotes(e.target.value)}
              rows={2}
              placeholder="No onions, ring the bell twice..."
              className="textarea w-full mt-1 bg-cream border-sand focus:border-mango rounded-xl focus-ring"

            />
          </div>
                    <div className="ticket-card shadow-card p-5">

            <p className="text-sm font-medium text-ink/70 mb-3">
              Payment method
            </p>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex flex-col items-center gap-2 py-4 rounded-xl border text-sm font-medium transition-colors ${
                    method === m.key
                      ? 'border-mango bg-mango/10 text-mango-dark'
                      : 'border-sand text-ink/60 hover:border-mango'
                  }`}

                >
                  <m.icon size={20} />
                  {m.label}
                </button>
              ))}
            </div>
            {!method && (
              <p className="text-red-500 text-sm mt-3">
                Please select a payment method.
              </p>

            )}
          </div>
        </div>
        <div className="md:col-span-2">
        <div className="ticket-card shadow-card p-5 sticky top-20">
            <h2 className="font-display font-semibold text-lg text-ink mb-3">
              {cart.restaurantName}
            </h2>
            <ul className="divide-y divide-sand text-sm">
              {cart.items.map((i) => (
                <li
                  key={i.menu_id}
                  className="flex justify-between py-2"
                >
                  <span className="text-ink/70">
                    {i.quantity} × {i.name}
                  </span>
                  <span className="price-tag">
                    {formatCurrency(i.price * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center pt-3 border-t border-sand mt-2">
             <span className="font-semibold text-ink">
                Total
              </span>
              <span className="price-tag font-bold text-mango-dark text-lg">
                {formatCurrency(total)}
              </span>
            </div>
            <button
              type="submit"
              disabled={placing || !method}
              className="btn w-full bg-mango hover:bg-mango-dark text-white border-none rounded-xl mt-4 focus-ring disabled:opacity-50 disabled:cursor-not-allowed"

            >
              {placing
                ? 'Placing order...'
                : `Place order · ${formatCurrency(total)}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}