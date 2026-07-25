import{useEffect,useState}from'react'
import{Receipt,MapPin}from'lucide-react'
import StatusBadge from'./StatusBadge.jsx'
import{formatCurrency,formatDate}from'../../utils/helpers'
import menuService from'../../services/menuService.js'
export default function OrderCard({order,footer,meta}){
const[menuItems,setMenuItems]=useState({})
useEffect(()=>{
const fetchMenuNames=async()=>{
if(!order.items)return
const menuData={}
await Promise.all(
order.items.map(async(item)=>{
try{
const res=await menuService.getByID(item.menu_id)
menuData[item.menu_id]=res.data.data.name
}catch(error){
menuData[item.menu_id]="Unknown Item"
}
})
)
setMenuItems(menuData)
}
fetchMenuNames()
},[order.items])
return(
<div className="ticket-card shadow-card p-5">
<div className="flex items-start justify-between gap-3">
<div className="flex items-center gap-2">
<div className="w-9 h-9 rounded-full bg-sand flex items-center justify-center text-mango-dark shrink-0">
<Receipt size={16}/>
</div>
<div>
<p className="font-display font-semibold text-ink">Order Food</p>
<p className="text-xs text-ink/50">{formatDate(order.created_at)}</p>
</div>
</div>
<StatusBadge status={order.status}/>
</div>
{meta}
<ul className="mt-3 divide-y divide-sand/80 border-t border-sand pt-2">
{order.items?.map((item)=>(
<li key={item.id} className="flex justify-between py-1.5 text-sm">
<div className="flex items-center gap-2">
<span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-md bg-mango/15 text-mango-dark">
{item.quantity}x
</span>
<span className="font-medium text-ink">
{menuItems[item.menu_id]||"Loading..."}
</span>
</div>
<span className="price-tag text-ink/80">
{formatCurrency(item.price*item.quantity)}
</span>
</li>
))}
</ul>
{order.delivery_address&&(
<div className="flex items-start gap-1.5 mt-2 text-xs text-ink/50">
<MapPin size={13} className="mt-0.5 shrink-0"/>
<span>{order.delivery_address}</span>
</div>
)}
{order.notes&&(
<p className="text-xs text-ink/50 mt-1 italic">"{order.notes}"</p>
)}
<div className="flex items-center justify-between mt-4 pt-3 border-t border-sand">
<span className="text-sm text-ink/60">Total</span>
<span className="price-tag text-mango-dark font-bold text-lg">
{formatCurrency(order.total_amount)}
</span>
</div>
{footer&&(
<div className="mt-4 flex flex-wrap gap-2">
{footer}
</div>
)}
</div>
)
}