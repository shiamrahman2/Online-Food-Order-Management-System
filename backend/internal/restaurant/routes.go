package restaurant

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	adminRole := middleware.RoleMiddleware("admin")
	restaurantRole := middleware.RoleMiddleware("restaurant")

	return []router.Route{
		// Admin routes
		{
			Method:      "POST",
			Pattern:     "/api/admin/restaurants",
			Handler:     handler.Create,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/admin/restaurants",
			Handler:     handler.GetAllRestaurants,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "DELETE",
			Pattern:     "/api/admin/restaurants/:id",
			Handler:     handler.Delete,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:"PUT",
			Pattern:"/api/admin/restaurants/:id",
			Handler:handler.UpdateProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		// Public routes
		{
			Method:  "POST",
			Pattern: "/api/restaurants/login",
			Handler: handler.Login,
		},
		{
			Method:  "GET",
			Pattern: "/api/restaurants",
			Handler: handler.GetAllRestaurants,
		},
		{
			Method:  "GET",
			Pattern: "/api/restaurants/:id",
			Handler: handler.GetRestaurantByID,
		},
		// Restaurant routes
		{
			Method:      "GET",
			Pattern:     "/api/restaurant/profile",
			Handler:     handler.GetProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/restaurant/profile",
			Handler:     handler.UpdateProfileByRestaurant,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/restaurant/change-password",
			Handler:     handler.ChangePassword,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
	}
}
