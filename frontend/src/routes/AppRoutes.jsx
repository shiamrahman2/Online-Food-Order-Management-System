import { Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard,
  User,
  UtensilsCrossed,
  ClipboardList,
  Store,
  Users,
  Bike,
  Receipt,
} from 'lucide-react'

import PublicLayout from '../components/layout/PublicLayout.jsx'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import RoleRoute from '../components/common/RoleRoute.jsx'
import { ROLES } from '../utils/constants.js'

// Public pages
import Home from '../pages/public/Home.jsx'
import RestaurantDetails from '../pages/public/RestaurantDetails.jsx'
import Search from '../pages/public/Search.jsx'
import Login from '../pages/public/Login.jsx'
import CustomerRegister from '../pages/public/CustomerRegister.jsx'
import AdminRegister from '../pages/public/AdminRegister.jsx'
import NotFound from '../pages/public/NotFound.jsx'

// Customer pages
import CustomerDashboard from '../pages/customer/Dashboard.jsx'
import CustomerProfile from '../pages/customer/Profile.jsx'
import Cart from '../pages/customer/Cart.jsx'
import Checkout from '../pages/customer/Checkout.jsx'
import CustomerOrders from '../pages/customer/Orders.jsx'

// Restaurant pages
import RestaurantDashboard from '../pages/restaurant/Dashboard.jsx'
import RestaurantProfile from '../pages/restaurant/Profile.jsx'
import MenuList from '../pages/restaurant/MenuList.jsx'
import CreateMenu from '../pages/restaurant/CreateMenu.jsx'
import EditMenu from '../pages/restaurant/EditMenu.jsx'
import RestaurantOrders from '../pages/restaurant/Orders.jsx'
import GuestOrCustomerRoute from '../routes/GuestOrCustomerRoute.jsx'

// Admin pages
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminProfile from '../pages/admin/Profile.jsx'
import AdminRestaurants from '../pages/admin/Restaurants.jsx'
import CreateRestaurant from '../pages/admin/CreateRestaurant.jsx'
import EditRestaurant from '../pages/admin/EditRestaurant.jsx'
import AdminCustomers from '../pages/admin/Customers.jsx'
import AdminDeliveryPersons from '../pages/admin/DeliveryPersons.jsx'
import CreateDeliveryPerson from '../pages/admin/CreateDeliveryPerson.jsx'
import AdminOrders from '../pages/admin/Orders.jsx'
import AdminPayments from '../pages/admin/Payments.jsx'

// Delivery pages
import DeliveryDashboard from '../pages/delivery/Dashboard.jsx'
import DeliveryProfile from '../pages/delivery/Profile.jsx'
import DeliveryOrders from '../pages/delivery/Orders.jsx'

const CUSTOMER_LINKS = [
  { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/customer/orders', label: 'Orders', icon: ClipboardList },
  { to: '/customer/profile', label: 'Profile', icon: User },
]

const RESTAURANT_LINKS = [
  { to: '/restaurant/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/restaurant/menu', label: 'Menu', icon: UtensilsCrossed },
  { to: '/restaurant/orders', label: 'Orders', icon: ClipboardList },
  { to: '/restaurant/profile', label: 'Profile', icon: User },
]

const ADMIN_LINKS = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/restaurants', label: 'Restaurants', icon: Store },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/delivery-persons', label: 'Delivery persons', icon: Bike },
  { to: '/admin/orders', label: 'Orders', icon: ClipboardList },
  { to: '/admin/payments', label: 'Payments', icon: Receipt },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

const DELIVERY_LINKS = [
  { to: '/delivery/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/delivery/orders', label: 'Orders', icon: ClipboardList },
  { to: '/delivery/profile', label: 'Profile', icon: User },
]

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public site */}
      <Route element={<PublicLayout />}>
         <Route path="/" element={<Navigate to="/home" replace />} /> 
         <Route path="/home" element={<Home />} />
          {/* <Route path="/search" element={<Search />} /> */}
        {/* <Route path="/restaurant/:id" element={<RestaurantDetails />} /> */}
        <Route path="/restaurants/:id" element={<RestaurantDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<CustomerRegister />} />
        <Route path="/admin/register" element={<AdminRegister />} />

        {/* Customer cart/checkout live in the public shell (navbar + footer) */}
        <Route
          path="/cart"
          element={
            <RoleRoute allow={[ROLES.CUSTOMER]}>
              <Cart />
            </RoleRoute>
          }
        />
        {/* <Route
  path="/"
  element={
    <RoleRoute allow={[ROLES.CUSTOMER]}>
      <Navigate to="/home" replace />
    </RoleRoute>
  }
/> */}
{/* <Route
  path="/"
  element={<Navigate to="/home" replace />}
/>

<Route
  path="/home"
  element={
    <GuestOrCustomerRoute>
      <Home />
    </GuestOrCustomerRoute>
  }
/> */}

{/* <Route
  path="/search"
  element={
    <GuestOrCustomerRoute>
      <Search />
    </GuestOrCustomerRoute>
  }
/> */}
 {/* <Route
  path="/home"
  element={
    <RoleRoute allow={[ROLES.CUSTOMER]}>
      <Home />
    </RoleRoute>
  }
/>  */}

<Route
  path="/search"
  element={
    <RoleRoute allow={[ROLES.CUSTOMER]}>
      <Search />
    </RoleRoute>
  }
/>

{/* <Route
  path="/checkout"
  element={
    <RoleRoute allow={[ROLES.CUSTOMER]}>
      <Checkout />
    </RoleRoute>
  }
/> */}
        <Route
          path="/checkout"
          element={
            <RoleRoute allow={[ROLES.CUSTOMER]}>
              <Checkout />
            </RoleRoute>
          }
        />
      </Route>

      {/* Customer dashboard */}
      <Route
        path="/customer/*"
        element={
          <RoleRoute allow={[ROLES.CUSTOMER]}>
            <DashboardLayout title="Customer" links={CUSTOMER_LINKS}>
              <Routes>
                <Route path="dashboard" element={<CustomerDashboard />} />
                <Route path="orders" element={<CustomerOrders />} />
                <Route path="profile" element={<CustomerProfile />} />
              </Routes>
            </DashboardLayout>
          </RoleRoute>
        }
      />

      {/* Restaurant dashboard */}
      <Route
        path="/restaurant/*"
        element={
          <RoleRoute allow={[ROLES.RESTAURANT]}>
            <DashboardLayout title="Restaurant" links={RESTAURANT_LINKS}>
              <Routes>
                <Route path="dashboard" element={<RestaurantDashboard />} />
                <Route path="menu" element={<MenuList />} />
                <Route path="menu/create" element={<CreateMenu />} />
                <Route path="menu/:id/edit" element={<EditMenu />} />
                <Route path="orders" element={<RestaurantOrders />} />
                <Route path="profile" element={<RestaurantProfile />} />
              </Routes>
            </DashboardLayout>
          </RoleRoute>
        }
      />

      {/* Admin dashboard */}
      <Route
        path="/admin/*"
        element={
          <RoleRoute allow={[ROLES.ADMIN]}>
            <DashboardLayout title="Admin" links={ADMIN_LINKS}>
              <Routes>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="restaurants" element={<AdminRestaurants />} />
                <Route path="restaurants/create" element={<CreateRestaurant />} />
                <Route path="restaurants/:id/edit" element={<EditRestaurant />} />
                <Route path="customers" element={<AdminCustomers />} />
                <Route path="delivery-persons" element={<AdminDeliveryPersons />} />
                <Route path="delivery-persons/create" element={<CreateDeliveryPerson />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="payments" element={<AdminPayments />} />
                <Route path="profile" element={<AdminProfile />} />
              </Routes>
            </DashboardLayout>
          </RoleRoute>
        }
      />

      {/* Delivery dashboard */}
      <Route
        path="/delivery/*"
        element={
          <RoleRoute allow={[ROLES.DELIVERY]}>
            <DashboardLayout title="Delivery" links={DELIVERY_LINKS}>
              <Routes>
                <Route path="dashboard" element={<DeliveryDashboard />} />
                <Route path="orders" element={<DeliveryOrders />} />
                <Route path="profile" element={<DeliveryProfile />} />
              </Routes>
            </DashboardLayout>
          </RoleRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
