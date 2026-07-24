// package menu

// import (
// 	"net/http"

// 	"food-order-management/config"
// 	"food-order-management/pkg/middleware"
// 	"food-order-management/pkg/router"
// )

// func Routes(handler *Handler, cfg *config.Config) []router.Route {
// 	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
// 	restaurantRole := middleware.RoleMiddleware("restaurant")

//		return []router.Route{
//			{
//				Method:      "POST",
//				Pattern:     "/api/restaurant/menu",
//				Handler:     handler.Create,
//				Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
//			},
//			{
//				Method:  "GET",
//				Pattern: "/api/menu/",
//				Handler: handler.GetByID,
//			},
//			{
//				Method:      "PUT",
//				Pattern:     "/api/restaurant/menu/",
//				Handler:     handler.Update,
//				Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
//			},
//			{
//				Method:      "DELETE",
//				Pattern:     "/api/restaurant/menu/",
//				Handler:     handler.Delete,
//				Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
//			},
//			{
//				Method:  "GET",
//				Pattern: "/api/restaurant/",
//				Handler: handler.GetByRestaurantID,
//			},
//			{
//				Method:      "GET",
//				Pattern:     "/api/restaurant/menu",
//				Handler:     handler.GetByRestaurantID,
//				Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
//			},
//			{
//				Method:  "GET",
//				Pattern: "/api/menu/search",
//				Handler: handler.Search,
//			},
//		}
//	}
package menu

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/router"
)

func Routes(handler *Handler, cfg *config.Config) []router.Route {
	authMiddleware := middleware.AuthMiddleware(cfg.JwtSecretKey)
	restaurantRole := middleware.RoleMiddleware("restaurant")

	return []router.Route{
		// Restaurant authenticated routes
		{
			Method:      "POST",
			Pattern:     "/api/restaurant/menu",
			Handler:     handler.Create,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "GET",
			Pattern:     "/api/restaurant/menu",
			Handler:     handler.GetRestaurantMenu,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "PUT",
			Pattern:     "/api/restaurant/menu/:id",
			Handler:     handler.Update,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		{
			Method:      "DELETE",
			Pattern:     "/api/restaurant/menu/:id",
			Handler:     handler.Delete,
			Middlewares: []func(http.Handler) http.Handler{authMiddleware, restaurantRole},
		},
		// Public routes
		{
			Method:  "GET",
			Pattern: "/api/menu/search",
			Handler: handler.Search,
		},
		{
			Method:  "GET",
			Pattern: "/api/menu/:id",
			Handler: handler.GetByID,
		},
		{
			Method:  "GET",
			Pattern: "/api/restaurant/:id/menu",
			Handler: handler.GetPublicRestaurantMenu,
		},
	}
}
