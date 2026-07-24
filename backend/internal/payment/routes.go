package payment

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	customerRole := middleware.RoleMiddleware("customer")
	adminRole := middleware.RoleMiddleware("admin")

	return []router.Route{
		{
			Method:      "POST",
			Pattern:     "/api/payments",
			Handler:     handler.Create,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/payments",
			Handler:     handler.GetByOrderID,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware},
		},
		{
			Method:      "GET",
			Pattern:     "/api/payments/:id",
			Handler:     handler.GetByID,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware},
		},
		{
			Method:      "GET",
			Pattern:     "/api/admin/payments",
			Handler:     handler.GetAllPayments,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/admin/payments/:id/status",
			Handler:     handler.UpdateStatus,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
	}
}