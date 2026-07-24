package payment

import (
	"encoding/json"
	"fmt"
	"food-order-management/config"
	"food-order-management/pkg/middleware"
	"food-order-management/pkg/response"
	"net/http"
	"strconv"
	"strings"
)

type Handler struct {
	service Service
	cfg     *config.Config
}

func NewHandler(service Service, cfg *config.Config) *Handler {
	return &Handler{service: service, cfg: cfg}
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var req CreatePaymentRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	payment, err := h.service.Create(r.Context(), &req)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Payment created successfully", payment)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/payments/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid payment ID")
		return
	}

	payment, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		response.NotFound(w, "Payment not found")
		return
	}

	response.Success(w, "Payment retrieved successfully", payment)
}

func (h *Handler) GetByOrderID(w http.ResponseWriter, r *http.Request) {
	orderIDStr := r.URL.Query().Get("order_id")
	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		response.BadRequest(w, "Invalid order ID")
		return
	}

	payment, err := h.service.GetByOrderID(r.Context(), orderID)
	if err != nil {
		response.NotFound(w, "Payment not found")
		return
	}

	response.Success(w, "Payment retrieved successfully", payment)
}

func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/payments/")
	idStr = strings.TrimSuffix(idStr, "/status")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid payment ID")
		return
	}

	var req UpdatePaymentStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.service.UpdateStatus(r.Context(), id, &req); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Payment status updated successfully", nil)
}

// func (h *Handler) GetAllPayments(w http.ResponseWriter, r *http.Request) {
// 	userID := middleware.GetUserID(r)
// 	role := middleware.GetRole(r)

// 	if role == "customer" {
// 		// Customers can only view their own payments
// 		response.Success(w, "Payments retrieved successfully", []interface{}{})
// 		return
// 	}

// 	_ = userID // Use as needed for filtering

// 	payments, err := h.service.GetAllPayments(r.Context())
// 	if err != nil {
// 		response.InternalServerError(w, "Failed to fetch payments")
// 		return
// 	}

// 	response.Success(w, "Payments retrieved successfully", payments)
// }
func (h *Handler) GetAllPayments(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	role := middleware.GetRole(r)

	if role == "customer" {
		response.Success(w, "Payments retrieved successfully", []interface{}{})
		return
	}

	_ = userID

	payments, err := h.service.GetAllPayments(r.Context())
	if err != nil {
		fmt.Println("GET PAYMENTS ERROR:", err)
		response.InternalServerError(w, err.Error())
		return
	}

	response.Success(w, "Payments retrieved successfully", payments)
}