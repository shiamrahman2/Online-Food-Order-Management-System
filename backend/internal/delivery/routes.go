package delivery

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	adminRole := middleware.RoleMiddleware("admin")
	deliveryRole := middleware.RoleMiddleware("delivery")

	return []router.Route{
		// Admin routes
		{
			Method:      "POST",
			Pattern:     "/api/admin/delivery-persons",
			Handler:     handler.Create,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/admin/delivery-persons",
			Handler:     handler.GetAll,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "DELETE",
			Pattern:     "/api/admin/delivery-persons/:id",
			Handler:     handler.Delete,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		// Public routes
		{
			Method:  "POST",
			Pattern: "/api/delivery/login",
			Handler: handler.Login,
		},
		// Delivery routes
		{
			Method:      "GET",
			Pattern:     "/api/delivery/profile",
			Handler:     handler.GetProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, deliveryRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/delivery/profile",
			Handler:     handler.UpdateProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, deliveryRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/delivery/change-password",
			Handler:     handler.ChangePassword,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, deliveryRole},
		},
	}
}
