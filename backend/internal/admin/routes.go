package admin

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	adminRole := middleware.RoleMiddleware("admin")

	return []router.Route{
		{
			Method:  "POST",
			Pattern: "/api/admin/register",
			Handler: handler.Register,
		},
		{
			Method:  "POST",
			Pattern: "/api/admin/login",
			Handler: handler.Login,
		},
		{
			Method:      "GET",
			Pattern:     "/api/admin/profile",
			Handler:     handler.GetProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/admin/profile",
			Handler:     handler.UpdateProfile,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/admin/change-password",
			Handler:     handler.ChangePassword,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
		
	}
}