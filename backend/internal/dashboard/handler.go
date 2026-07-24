package dashboard

import (
	"net/http"

	"food-order-management/config"
	"food-order-management/pkg/response"
)

type Handler struct {
	service Service
	cfg     *config.Config
}

func NewHandler(service Service, cfg *config.Config) *Handler {
	return &Handler{service: service, cfg: cfg}
}

func (h *Handler) GetStats(w http.ResponseWriter, r *http.Request) {
	stats, err := h.service.GetStats(r.Context())
	if err != nil {
		response.InternalServerError(w, "Failed to fetch dashboard statistics")
		return
	}

	response.Success(w, "Dashboard statistics retrieved successfully", stats)
}