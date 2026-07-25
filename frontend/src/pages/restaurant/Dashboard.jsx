import{useEffect,useState}from'react'
import{Link}from'react-router-dom'
import toast from'react-hot-toast'
import{UtensilsCrossed,ClipboardList,Clock,Plus,ListChecks,Banknote}from'lucide-react'
import restaurantService from'../../services/restaurantService.js'
import menuService from'../../services/menuService.js'
import paymentService from'../../services/paymentService.js'
import{useAuth}from'../../context/AuthContext.jsx'
import OrderCard from'../../components/common/OrderCard.jsx'
import Skeleton from'../../components/common/Skeleton.jsx'
import EmptyState from'../../components/common/EmptyState.jsx'
import{ORDER_STATUS}from'../../utils/constants.js'
import{getErrorMessage}from'../../utils/helpers.js'
export default function RestaurantDashboard(){
const{user}=useAuth()
const[menu,setMenu]=useState([])
const[orders,setOrders]=useState([])
const[loading,setLoading]=useState(true)
useEffect(()=>{
Promise.all([
menuService.getMyMenu(),
restaurantService.getOrders()
])
.then(async([menuRes,ordersRes])=>{
const ordersData=ordersRes.data.data||[]
const ordersWithPayment=await Promise.all(
ordersData.map(async(order)=>{
try{
const paymentRes=await paymentService.getPaymentByOrder(order.id)
return{...order,payment:paymentRes.data.data||null}
}catch(error){
return{...order,payment:null}
}
})
)
setMenu(menuRes.data.data||[])
setOrders(ordersWithPayment)
})
.catch((err)=>toast.error(getErrorMessage(err)))
.finally(()=>setLoading(false))
},[])
const pendingCount=orders.filter((o)=>o.status===ORDER_STATUS.PENDING).length
const recentOrders=orders.slice(0,3)
const revenue=orders.reduce((total,order)=>{
if(order.payment?.payment_status?.toLowerCase()==="paid"){
return total+Number(order.payment.amount)
}
return total
},0)
return(
<div>
<h1 className="font-display text-3xl font-bold text-ink">{user?.name}</h1>
<p className="text-ink/60 mt-1">Here's what's happening in your kitchen today.</p>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
<Link to="/restaurant/menu/create" className="ticket-card shadow-card p-5 flex items-center gap-4 hover:shadow-soft transition-shadow">
<span className="w-11 h-11 rounded-full bg-mango/10 text-mango-dark flex items-center justify-center"><Plus size={20}/></span>
<div>
<p className="font-semibold text-ink">Add menu item</p>
<p className="text-xs text-ink/50">List a new dish on your menu</p>
</div>
</Link>
<Link to="/restaurant/orders" className="ticket-card shadow-card p-5 flex items-center gap-4 hover:shadow-soft transition-shadow">
<span className="w-11 h-11 rounded-full bg-basil/10 text-basil flex items-center justify-center"><ListChecks size={20}/></span>
<div>
<p className="font-semibold text-ink">Manage orders</p>
<p className="text-xs text-ink/50">Accept, prepare, and mark ready</p>
</div>
</Link>
</div>
<div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
<div className="ticket-card shadow-card p-5 flex items-center gap-4">
<span className="w-11 h-11 rounded-full bg-mango/10 text-mango-dark flex items-center justify-center"><UtensilsCrossed size={20}/></span>
<div>
<p className="text-2xl font-bold text-ink font-display">{menu.length}</p>
<p className="text-xs text-ink/50">Menu items</p>
</div>
</div>
<div className="ticket-card shadow-card p-5 flex items-center gap-4">
<span className="w-11 h-11 rounded-full bg-basil/10 text-basil flex items-center justify-center"><ClipboardList size={20}/></span>
<div>
<p className="text-2xl font-bold text-ink font-display">{orders.length}</p>
<p className="text-xs text-ink/50">Total orders</p>
</div>
</div>
<div className="ticket-card shadow-card p-5 flex items-center gap-4">
<span className="w-11 h-11 rounded-full bg-chili/10 text-chili flex items-center justify-center"><Clock size={20}/></span>
<div>
<p className="text-2xl font-bold text-ink font-display">{pendingCount}</p>
<p className="text-xs text-ink/50">Awaiting response</p>
</div>
</div>
<div className="ticket-card shadow-card p-5 flex items-center gap-4">
<span className="w-11 h-11 rounded-full bg-basil/10 text-basil flex items-center justify-center"><Banknote size={20}/></span>
<div>
<p className="text-2xl font-bold text-ink font-display">৳ {revenue.toLocaleString('en-BD')}</p>
<p className="text-xs text-ink/50">Revenue</p>
</div>
</div>
</div>
<div className="mt-10">
<div className="flex items-center justify-between mb-4">
<h2 className="font-display text-xl font-semibold text-ink">Recent orders</h2>
<Link to="/restaurant/orders" className="text-sm text-mango-dark font-semibold hover:underline">View all</Link>
</div>
{loading&&<Skeleton count={3}/>}
{!loading&&recentOrders.length===0&&<EmptyState title="No orders yet" message="Orders from customers will appear here."/>}
{!loading&&recentOrders.length>0&&(
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
{recentOrders.map((o)=>(<OrderCard key={o.id} order={o}/>))}
</div>
)}
</div>
</div>
)
}