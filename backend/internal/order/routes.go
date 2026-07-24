package order

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	customerRole := middleware.RoleMiddleware("customer")
	restaurantRole := middleware.RoleMiddleware("restaurant")
	deliveryRole := middleware.RoleMiddleware("delivery")
	adminRole := middleware.RoleMiddleware("admin")

	return []router.Route{
		// Customer routes
		{
			Method:      "POST",
			Pattern:     "/api/customer/orders",
			Handler:     handler.Create,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/customer/orders",
			Handler:     handler.GetCustomerOrders,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/customer/orders/:id/cancel",
			Handler:     handler.CancelOrder,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		// Restaurant routes
		{
			Method:      "GET",
			Pattern:     "/api/restaurant/orders",
			Handler:     handler.GetRestaurantOrders,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/restaurant/orders/:id/status",
			Handler:     handler.UpdateStatus,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		// Delivery routes
		{
			Method:      "GET",
			Pattern:     "/api/delivery/orders",
			Handler:     handler.GetDeliveryOrders,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, deliveryRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/delivery/orders/:id/status",
			Handler:     handler.UpdateStatus,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, deliveryRole},
		},
		// Admin routes
		{
			Method:      "GET",
			Pattern:     "/api/admin/orders",
			Handler:     handler.GetAllOrders,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/admin/orders/:id/assign",
			Handler:     handler.AssignDeliveryPerson,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/orders/:id",
			Handler:     handler.GetByID,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware},
		},
	}
}