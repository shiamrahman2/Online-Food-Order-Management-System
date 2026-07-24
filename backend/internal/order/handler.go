package order

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"strings"

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

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	var req CreateOrderRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	order, err := h.service.Create(r.Context(), &req, userID)
	if err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Created(w, "Order created successfully", order)
}

func (h *Handler) GetByID(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/orders/")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid order ID")
		return
	}

	order, err := h.service.GetByID(r.Context(), id)
	if err != nil {
		response.NotFound(w, "Order not found")
		return
	}

	response.Success(w, "Order retrieved successfully", order)
}

func (h *Handler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)
	role := middleware.GetRole(r)

	// idStr := strings.TrimPrefix(r.URL.Path, "/api/orders/")
	// idStr = strings.TrimSuffix(idStr, "/status")
	// id, err := strconv.Atoi(idStr)
	// idStr := strings.TrimPrefix(r.URL.Path, "/api/restaurant/orders/")
	// idStr = strings.TrimSuffix(idStr, "/status")

	// id, err := strconv.Atoi(idStr)
	parts := strings.Split(r.URL.Path, "/")

	id, err := strconv.Atoi(parts[4])
	if err != nil {
		response.BadRequest(w, "Invalid order ID")
		return
	}
	fmt.Println(id)

	var req UpdateOrderStatusRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.service.UpdateStatus(r.Context(), id, req.Status, role, userID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Order status updated successfully", nil)
}

func (h *Handler) AssignDeliveryPerson(w http.ResponseWriter, r *http.Request) {
	idStr := strings.TrimPrefix(r.URL.Path, "/api/admin/orders/")
	idStr = strings.TrimSuffix(idStr, "/assign")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid order ID")
		return
	}

	var req AssignDeliveryPersonRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.BadRequest(w, "Invalid request body")
		return
	}

	if err := h.service.AssignDeliveryPerson(r.Context(), id, req.DeliveryPersonID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Delivery person assigned successfully", nil)
}

func (h *Handler) GetCustomerOrders(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	orders, err := h.service.GetCustomerOrders(r.Context(), userID)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch orders")
		return
	}

	response.Success(w, "Orders retrieved successfully", orders)
}

func (h *Handler) GetRestaurantOrders(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	orders, err := h.service.GetRestaurantOrders(r.Context(), userID)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch orders")
		return
	}

	response.Success(w, "Orders retrieved successfully", orders)
}

func (h *Handler) GetDeliveryOrders(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	orders, err := h.service.GetDeliveryOrders(r.Context(), userID)
	if err != nil {
		response.InternalServerError(w, "Failed to fetch orders")
		return
	}

	response.Success(w, "Orders retrieved successfully", orders)
}

func (h *Handler) GetAllOrders(w http.ResponseWriter, r *http.Request) {
	orders, err := h.service.GetAllOrders(r.Context())
	if err != nil {
		response.InternalServerError(w, "Failed to fetch orders")
		return
	}

	response.Success(w, "Orders retrieved successfully", orders)
}

func (h *Handler) CancelOrder(w http.ResponseWriter, r *http.Request) {
	userID := middleware.GetUserID(r)

	idStr := strings.TrimPrefix(r.URL.Path, "/api/customer/orders/")
	idStr = strings.TrimSuffix(idStr, "/cancel")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.BadRequest(w, "Invalid order ID")
		return
	}

	if err := h.service.CancelOrder(r.Context(), id, userID); err != nil {
		response.BadRequest(w, err.Error())
		return
	}

	response.Success(w, "Order cancelled successfully", nil)
}
