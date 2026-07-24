// package dashboard

// import (
// 	"net/http"

// 	"food-order-management/config"
// 	"food-order-management/pkg/middleware"
// 	"food-order-management/pkg/router"
// )

// func Routes(handler *Handler, cfg *config.Config) []router.Route {
// 	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
// 	adminRole := middleware.RoleMiddleware("admin")

// 	return []router.Route{
// 		{
// 			Method:      "GET",
// 			Pattern:     "/api/admin/dashboard",
// 			Handler:     handler.GetStats,
// 			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
// 		},
// 	}
// }
package dashboard

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
			Method:      "GET",
			Pattern:     "/api/admin/dashboard",
			Handler:     handler.GetStats,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, adminRole},
		},
	}
}