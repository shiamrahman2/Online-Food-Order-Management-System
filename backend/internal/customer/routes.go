package customer

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
			Method:  "POST",
			Pattern: "/api/customers/register",
			Handler: handler.Register,
		},
		{
			Method:  "POST",
			Pattern: "/api/customer/login",
			Handler: handler.Login,
		},
		{
			Method:      "GET",
			Pattern:     "/api/customer/profile",
			Handler:     handler.GetProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/customer/profile",
			Handler:     handler.UpdateProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/customer/change-password",
			Handler:     handler.ChangePassword,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, customerRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/admin/customers",
			Handler:     handler.GetAllCustomers,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
	}
}