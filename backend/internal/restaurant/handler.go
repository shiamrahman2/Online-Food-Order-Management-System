package restaurant

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

// Add this method to restaurant handler
func (h *Handler) GetRestaurantByID(w http.ResponseWriter, r *http.Request) {
	idStr := router.GetPathParam(r.URL.Path, "/api/restaurants/:id", "id")
	if idStr == "" {
		response.BadRequest(w, "Invalid restaurant ID")
		return
	}

	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid restaurant ID")
		return
	}

	restaurant, err := h.service.GetProfile(r.Context(), id)
	if err != nil {
		response.NotFound(w, "Restaurant not found")
		return
	}

	response.Success(w, "Restaurant retrieved successfully", restaurant)
}
func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	//userID := middleware.GetUserID(r)

	var req CreateRestaurantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	restaurant, err := h.service.Create(r.Context(), &req)//, userID
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Restaurant created successfully", restaurant)
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	resp, err := h.service.Login(r.Context(), &req, h.cfg.JwtSecretKey, h.cfg.JwtExpiration)
	if err != nil {
		response.Unauthorized(w, err.Error())
		return
	}

	response.Success(w, "Login successful", resp)
}

func (h *Handler) GetProfile(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	restaurant, err := h.service.GetProfile(r.Context(), userID)
	if err != nil {
		response.NotFound(w, "Restaurant not found")
		return
	}

	response.Success(w, "Profile retrieved successfully", restaurant)
}

func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	path := strings.TrimPrefix(r.URL.Path, "/api/admin/restaurants/")
	userID, err := strconv.Atoi(path)
	if err != nil {
		response.BadRequest(w, "Invalid restaurant id")
		return
	}
	//userID := middleware.GetUserID(r
	var req UpdateRestaurantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	restaurant, err := h.service.UpdateProfile(r.Context(), userID, &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Profile updated successfully", restaurant)
}
func (h *Handler) UpdateProfileByRestaurant(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	if userID == 0 {
		response.BadRequest(w, "Invalid user id")
		return
	}
	//userID := middleware.GetUserID(r
	var req UpdateRestaurantRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	restaurant, err := h.service.UpdateProfile(r.Context(), userID, &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Profile updated successfully", restaurant)
}
func (h *Handler) ChangePassword(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req ChangePasswordRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.service.ChangePassword(r.Context(), userID, &req); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Password changed successfully", nil)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/restaurants/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid restaurant ID")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		response.InternalServerError(w, "Failed to delete restaurant")
		return
	}

	response.Success(w, "Restaurant deleted successfully", nil)
}

func (h *Handler) GetAllRestaurants(w http.ResponseWriter, r *http.Request) {
	restaurants, err := h.service.GetAllRestaurants(r.Context())
	if err != nil {
		response.InternalServerError(w, "Failed to fetch restaurants")
		return
	}

	response.Success(w, "Restaurants retrieved successfully", restaurants)
}
