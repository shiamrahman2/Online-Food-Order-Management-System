// package menu

// import (
// 	"encoding/json"
// 	"net/http"
// 	"strconv"
// 	"strings"

// 	"food-order-management/config"
// 	"food-order-management/pkg/middleware"
// 	"food-order-management/pkg/response"
// )

// type Handler struct {
// 	service Service
// 	cfg     *config.Config
// }

// func NewHandler(service Service, cfg *config.Config) *Handler {
// 	return &Handler{service: service, cfg: cfg}
// }

// func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)

// 	var req CreateMenuRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		response.BadRequest(w, "Invalid request body")
// 		return
// 	}

// 	menu, err := h.service.Create(r.Context(), &req, userID)
// 	if err != nil {
// 		response.BadRequest(w, err.Error())
// 		return
// 	}

// 	response.Created(w, "Menu created successfully", menu)
// }

// func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	menu, err := h.service.GetByID(r.Context(), id)
// 	if err != nil {
// 		response.NotFound(w, "Menu not found")
// 		return
// 	}

// 	response.Success(w, "Menu retrieved successfully", menu)
// }

// func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)

// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	var req UpdateMenuRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		response.BadRequest(w, "Invalid request body")
// 		return
// 	}

// 	menu, err := h.service.Update(r.Context(), id, &req, userID)
// 	if err != nil {
// 		response.BadRequest(w, err.Error())
// 		return
// 	}

// 	response.Success(w, "Menu updated successfully", menu)
// }

// func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)

// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	if err := h.service.Delete(r.Context(), id, userID); err != nil {
// 		response.BadRequest(w, err.Error())
// 		return
// 	}

// 	response.Success(w, "Menu deleted successfully", nil)
// }

// func (h *Handler) GetByRestaurantID(w http.ResponseWriter, r *http.Request) {
// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/")
// 	idStr = strings.TrimSuffix(idStr, "/menu")

// 	// Handle the case for authenticated restaurant
// 	if idStr == "" {
// 		userID := middleware.GetUserID(r)
// 		menus, err := h.service.GetByRestaurantID(r.Context(), userID)
// 		if err != nil {
// 			response.InternalServerError(w, "Failed to fetch menus")
// 			return
// 		}
// 		response.Success(w, "Menus retrieved successfully", menus)
// 		return
// 	}

// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid restaurant ID")
// 		return
// 	}

// 	menus, err := h.service.GetByRestaurantID(r.Context(), id)
// 	if err != nil {
// 		response.InternalServerError(w, "Failed to fetch menus")
// 		return
// 	}

// 	response.Success(w, "Menus retrieved successfully", menus)
// }

// func (h *Handler) Search(w http.ResponseWriter, r *http.Request) {
// 	query := r.URL.Query().Get("q")
// 	if query == "" {
// 		response.BadRequest(w, "Search query is required")
// 		return
// 	}

// 	menus, err := h.service.Search(r.Context(), query)
// 	if err != nil {
// 		response.InternalServerError(w, "Failed to search menus")
// 		return
// 	}

//		response.Success(w, "Search results retrieved successfully", menus)
//	}
package menu

import (
	"encoding/json"
	"net/http"
	"strconv"
	"strings"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/response"
	"food-order-management/pkg/router"
)

type Handler struct {
	service Service
	cfg     *config.Config
}

func NewHandler(service Service, cfg *config.Config) *Handler {
	return &Handler{service: service, cfg: cfg}
}
// Update handler methods to use router.GetPathParam
func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := router.GetPathParam(r.URL.Path, "/api/menu/:id", "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid menu ID")
		return
	}

	menu, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		response.NotFound(w, "Menu not found")
		return
	}

	response.Success(w, "Menu retrieved successfully", menu)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	
	idStr := router.GetPathParam(r.URL.Path, "/api/restaurant/menu/:id", "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid menu ID")
		return
	}

	var req UpdateMenuRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	menu, err := h.service.Update(r.Context(), id, &req, userID)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Menu updated successfully", menu)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	
	idStr := router.GetPathParam(r.URL.Path, "/api/restaurant/menu/:id", "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid menu ID")
		return
	}

	if err := h.service.Delete(r.Context(), id, userID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Menu deleted successfully", nil)
}

func (h *Handler) GetPublicRestaurantMenu(w http.ResponseWriter, r *http.Request) {
	idStr := router.GetPathParam(r.URL.Path, "/api/restaurant/:id/menu", "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid restaurant ID")
		return
	}

	menus, err := h.service.GetByRestaurantID(r.Context(), id)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch menus")
		return
	}

	response.Success(w, "Menus retrieved successfully", menus)
}
// HandleRestaurantRoutes handles all /api/restaurant/* routes
func (h *Handler) HandleRestaurantRoutes(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Path
	
	// Pattern: /api/restaurant/{id}/menu
	if strings.HasSuffix(path, "/menu") {
		// Extract restaurant ID
		// Remove prefix and suffix
		idStr := strings.TrimPrefix(path, "/api/restaurant/")
		idStr = strings.TrimSuffix(idStr, "/menu")
		
		// Check if it's not the authenticated restaurant menu route
		if idStr != "" {
			id, err := strconv.Atoi(idStr)
			if err != nil {
				response.BadRequest(w, "Invalid restaurant ID")
				return
			}
			
			menus, err := h.service.GetByRestaurantID(r.Context(), id)
			if err != nil {
				response.InternalServerError(w, "Failed to fetch menus")
				return
			}
			
			response.Success(w, "Menus retrieved successfully", menus)
			return
		}
	}
	
	// Pattern: /api/restaurant/{id} (get restaurant profile)
	if !strings.Contains(path, "/menu") {
		idStr := strings.TrimPrefix(path, "/api/restaurant/")
		if idStr != "" {
			// This could be a restaurant profile request
			// For now, return the restaurant menus
			id, err := strconv.Atoi(idStr)
			if err != nil {
				response.BadRequest(w, "Invalid restaurant ID")
				return
			}
			
			menus, err := h.service.GetByRestaurantID(r.Context(), id)
			if err != nil {
				response.InternalServerError(w, "Failed to fetch menus")
				return
			}
			
			response.Success(w, "Menus retrieved successfully", menus)
			return
		}
	}
	
	response.NotFound(w, "Route not found")
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req CreateMenuRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	menu, err := h.service.Create(r.Context(), &req, userID)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Menu created successfully", menu)
}

// func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	menu, err := h.service.GetByID(r.Context(), id)
// 	if err != nil {
// 		response.NotFound(w, "Menu not found")
// 		return
// 	}

// 	response.Success(w, "Menu retrieved successfully", menu)
// }

// func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)

// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	var req UpdateMenuRequest
// 	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
// 		response.BadRequest(w, "Invalid request body")
// 		return
// 	}

// 	menu, err := h.service.Update(r.Context(), id, &req, userID)
// 	if err != nil {
// 		response.BadRequest(w, err.Error())
// 		return
// 	}

// 	response.Success(w, "Menu updated successfully", menu)
// }

// func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)

// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/menu/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid menu ID")
// 		return
// 	}

// 	if err := h.service.Delete(r.Context(), id, userID); err != nil {
// 		response.BadRequest(w, err.Error())
// 		return
// 	}

// 	response.Success(w, "Menu deleted successfully", nil)
// }

// GetRestaurantMenu - For authenticated restaurant to get their own menu
func (h *Handler) GetRestaurantMenu(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	menus, err := h.service.GetByRestaurantID(r.Context(), userID)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch menus")
		return
	}
	response.Success(w, "Menus retrieved successfully", menus)
}

func (h *Handler) Search(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("q")
	if query == "" {
		response.BadRequest(w, "Search query is required")
		return
	}

	menus, err := h.service.Search(r.Context(), query)
	if err != nil {
		response.InternalServerError(w, "Failed to search menus")
		return
	}

	response.Success(w, "Search results retrieved successfully", menus)
}