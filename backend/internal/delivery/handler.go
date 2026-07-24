package delivery

import (
	"encoding/json"
	"net/http"
	"strconv"

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

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreateDeliveryPersonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	person, err := h.service.Create(r.Context(), &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Delivery person created successfully", person)
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

	person, err := h.service.GetProfile(r.Context(), userID)
	if err != nil {
		response.NotFound(w, "Delivery person not found")
		return
	}

	response.Success(w, "Profile retrieved successfully", person)
}

func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	person, err := h.service.UpdateProfile(r.Context(), userID, &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Profile updated successfully", person)
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

// func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
// 	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/delivery-persons/")
// 	id, err := strconv.Atoi(idStr)
// 	if err != nil {
// 		response.BadRequest(w, "Invalid delivery person ID")
// 		return
// 	}

// 	if err := h.service.Delete(r.Context(), id); err != nil {
// 		response.InternalServerError(w, "Failed to delete delivery person")
// 		return
// 	}

//		response.Success(w, "Delivery person deleted successfully", nil)
//	}
//
// Update handler to use router.GetPathParam
func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	idStr := router.GetPathParam(r.URL.Path, "/api/admin/delivery-persons/:id", "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid delivery person ID")
		return
	}

	if err := h.service.Delete(r.Context(), id); err != nil {
		response.InternalServerError(w, "Failed to delete delivery person")
		return
	}

	response.Success(w, "Delivery person deleted successfully", nil)
}

func (h *Handler) GetAll(w http.ResponseWriter, r *http.Request) {
	persons, err := h.service.GetAll(r.Context())
	if err != nil {
		response.InternalServerError(w, "Failed to fetch delivery persons")
		return
	}

	response.Success(w, "Delivery persons retrieved successfully", persons)
}
