# FoodHub — Food Ordering System Frontend

A Foodpanda-inspired food ordering frontend built with React + Vite, Tailwind CSS,
and DaisyUI, wired to match the provided Pure Golang + PostgreSQL backend API
exactly (no invented endpoints, no renamed fields).

## Tech stack

- React 18 + Vite
- React Router DOM (routing + role-based route guards)
- Axios (with JWT interceptors)
- Tailwind CSS + DaisyUI
- Context API (`AuthContext`, `CartContext`)
- Lucide React (icons)
- react-hot-toast (toast notifications)

## Getting started

```bash
npm install
npm run dev
```

The app expects the backend to be running at `http://localhost:8080/api`
(configured in `src/utils/constants.js`). Update `BASE_URL` there if your
backend runs elsewhere.

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build locally
```

## Roles & login

FoodHub has four roles, each with its own login flow and dashboard:

| Role       | Can register?         | Redirects to           |
|------------|------------------------|-------------------------|
| Customer   | Yes (`/register`)      | `/customer/dashboard`   |
| Admin      | Once (`/admin/register`) | `/admin/dashboard`    |
| Restaurant | No — created by admin  | `/restaurant/dashboard` |
| Delivery   | No — created by admin  | `/delivery/dashboard`   |

The `/login` page has tabs to switch between the four roles.

## Project structure

```
src/
  components/
    common/     Reusable UI: cards, badges, modal, route guards, etc.
    layout/     Navbar, Footer, Sidebar, PublicLayout, DashboardLayout
  pages/
    public/     Home, Search, RestaurantDetails, Login, Register, 404
    customer/   Dashboard, Cart, Checkout, Orders, Profile
    restaurant/ Dashboard, Menu CRUD, Orders, Profile
    admin/      Dashboard, Restaurants/Delivery-persons CRUD, Orders, Payments, Profile
    delivery/   Dashboard, Orders, Profile
  context/      AuthContext (session/JWT), CartContext (cart state)
  services/     One file per API resource, thin wrappers around axios
  routes/       AppRoutes.jsx — all route definitions & guards
  utils/        token storage, constants, formatting helpers
```

## Notes

- The cart is scoped to a single restaurant at a time (backend orders belong
  to one restaurant); adding an item from a different restaurant starts a
  fresh cart.
- JWT is stored in `localStorage` and attached automatically to every request
  via an Axios interceptor. A 401 response clears the session and redirects
  to `/login`.
- All request/response field names match the API documentation exactly.
