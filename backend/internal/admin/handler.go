package admin

import (
	"encoding/json"
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/response"
)

type Handler struct {
	service Service
	cfg     *config.Config
}

func NewHandler(service Service, cfg *config.Config) *Handler {
	return &Handler{service: service, cfg: cfg}
}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	var req RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	admin, err := h.service.Register(r.Context(), &req)
	if err != nil {
		if err.Error() == "admin already exists" {
			response.Conflict(w, err.Error())
			return
		}
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Admin registered successfully", admin)
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

	admin, err := h.service.GetProfile(r.Context(), userID)
	if err != nil {
		response.NotFound(w, "Admin not found")
		return
	}

	response.Success(w, "Profile retrieved successfully", admin)
}

func (h *Handler) UpdateProfile(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req UpdateProfileRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	admin, err := h.service.UpdateProfile(r.Context(), userID, &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Profile updated successfully", admin)
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