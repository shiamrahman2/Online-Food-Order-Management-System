package order

import (
	"context"
	"fmt"

	"food-order-management/internal/menu"
)

type Service interface {
	Create(ctx context.Context, req *CreateOrderRequest, customerID int) (*OrderResponse, error)
	GetByID(ctx context.Context, id int) (*OrderResponse, error)
	UpdateStatus(ctx context.Context, id int, status string, role string, userID int) error
	AssignDeliveryPerson(ctx context.Context, orderID int, deliveryPersonID int) error
	GetCustomerOrders(ctx context.Context, customerID int) ([]OrderResponse, error)
	GetRestaurantOrders(ctx context.Context, restaurantID int) ([]OrderResponse, error)
	GetDeliveryOrders(ctx context.Context, deliveryPersonID int) ([]OrderResponse, error)
	GetAllOrders(ctx context.Context) ([]OrderResponse, error)
	CancelOrder(ctx context.Context, orderID int, customerID int) error
}

type service struct {
	repo     Repository
	menuRepo menu.Repository
}

func NewService(repo Repository, menuRepo menu.Repository) Service {
	return &service{repo: repo, menuRepo: menuRepo}
}

func (s *service) Create(ctx context.Context, req *CreateOrderRequest, customerID int) (*OrderResponse, error) {
	if len(req.Items) == 0 {
		return nil, fmt.Errorf("order must have at least one item")
	}

	// Calculate total amount and validate menu items
	var totalAmount float64
	for _, item := range req.Items {
		menuItem, err := s.menuRepo.FindByID(ctx, item.MenuID)
		if err != nil {
			return nil, fmt.Errorf("menu item %d not found", item.MenuID)
		}

		if !menuItem.IsAvailable {
			return nil, fmt.Errorf("menu item %s is not available", menuItem.Name)
		}

		if menuItem.RestaurantID != req.RestaurantID {
			return nil, fmt.Errorf("menu item %s does not belong to this restaurant", menuItem.Name)
		}

		totalAmount += menuItem.Price * float64(item.Quantity)
	}

	// Create order
	order := &Order{
		CustomerID:      customerID,
		RestaurantID:    req.RestaurantID,
		TotalAmount:     totalAmount,
		Status:          "pending",
		DeliveryAddress: req.DeliveryAddress,
		Notes:           req.Notes,
	}

	createdOrder, err := s.repo.Create(ctx, order)
	if err != nil {
		return nil, err
	}

	// Create order items
	var orderItems []OrderItemResponse
	for _, item := range req.Items {
		menuItem, _ := s.menuRepo.FindByID(ctx, item.MenuID)

		orderItem := &OrderItem{
			OrderID:  createdOrder.ID,
			MenuID:   item.MenuID,
			Quantity: item.Quantity,
			Price:    menuItem.Price,
		}

		createdItem, err := s.repo.CreateItem(ctx, orderItem)
		if err != nil {
			return nil, err
		}

		orderItems = append(orderItems, OrderItemResponse{
			ID:       createdItem.ID,
			MenuID:   createdItem.MenuID,
			Quantity: createdItem.Quantity,
			Price:    createdItem.Price,
		})
	}

	response := ToOrderResponse(createdOrder)
	response.Items = orderItems

	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id int) (*OrderResponse, error) {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	items, err := s.repo.FindItemsByOrderID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToOrderResponse(order)
	var orderItems []OrderItemResponse
	for _, item := range items {
		orderItems = append(orderItems, OrderItemResponse{
			ID:       item.ID,
			MenuID:   item.MenuID,
			Quantity: item.Quantity,
			Price:    item.Price,
		})
	}
	response.Items = orderItems

	return &response, nil
}

func (s *service) UpdateStatus(ctx context.Context, id int, status string, role string, userID int) error {
	order, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	// Validate status transitions based on role
	validTransitions := map[string][]string{
		"pending":    {"accepted", "cancelled"},
		"accepted":   {"preparing", "rejected"},
		"preparing":  {"ready"},
		"ready":      {"assigned"},
		"assigned":   {"picked_up"},
		"picked_up":  {"on_the_way"},
		"on_the_way": {"delivered"},
	}

	allowedStatuses, exists := validTransitions[order.Status]
	if !exists {
		return fmt.Errorf("invalid current status: %s", order.Status)
	}

	validTransition := false
	for _, s := range allowedStatuses {
		if s == status {
			validTransition = true
			break
		}
	}

	if !validTransition {
		return fmt.Errorf("cannot transition from %s to %s", order.Status, status)
	}

	// Check permissions
	switch role {
	case "restaurant":
		if order.RestaurantID != userID {
			return fmt.Errorf("unauthorized")
		}
		if status != "accepted" && status != "preparing" && status != "ready" && status != "rejected" {
			return fmt.Errorf("restaurant can only accept, prepare, mark ready, or reject orders")
		}
	case "admin":
		if status != "assigned" {
			return fmt.Errorf("admin can only assign delivery person")
		}
	case "delivery":
		if order.DeliveryPersonID == nil || *order.DeliveryPersonID != userID {
			return fmt.Errorf("unauthorized")
		}
		if status != "picked_up" && status != "on_the_way" && status != "delivered" {
			return fmt.Errorf("delivery person can only update to picked_up, on_the_way, or delivered")
		}
	case "customer":
		if order.CustomerID != userID {
			return fmt.Errorf("unauthorized")
		}
		if status != "cancelled" {
			return fmt.Errorf("customer can only cancel orders")
		}
	}

	return s.repo.UpdateStatus(ctx, id, status)
}

func (s *service) AssignDeliveryPerson(ctx context.Context, orderID int, deliveryPersonID int) error {
	order, err := s.repo.FindByID(ctx, orderID)
	if err != nil {
		return err
	}

	if order.Status != "ready" {
		return fmt.Errorf("can only assign delivery person to ready orders")
	}

	return s.repo.AssignDeliveryPerson(ctx, orderID, deliveryPersonID)
}

func (s *service) GetCustomerOrders(ctx context.Context, customerID int) ([]OrderResponse, error) {
	orders, err := s.repo.FindByCustomerID(ctx, customerID)
	if err != nil {
		return nil, err
	}

	return s.enrichOrders(ctx, orders)
}

func (s *service) GetRestaurantOrders(ctx context.Context, restaurantID int) ([]OrderResponse, error) {
	orders, err := s.repo.FindByRestaurantID(ctx, restaurantID)
	if err != nil {
		return nil, err
	}

	return s.enrichOrders(ctx, orders)
}

func (s *service) GetDeliveryOrders(ctx context.Context, deliveryPersonID int) ([]OrderResponse, error) {
	orders, err := s.repo.FindByDeliveryPersonID(ctx, deliveryPersonID)
	if err != nil {
		return nil, err
	}

	return s.enrichOrders(ctx, orders)
}

func (s *service) GetAllOrders(ctx context.Context) ([]OrderResponse, error) {
	orders, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	return s.enrichOrders(ctx, orders)
}

func (s *service) CancelOrder(ctx context.Context, orderID int, customerID int) error {
	order, err := s.repo.FindByID(ctx, orderID)
	if err != nil {
		return err
	}

	if order.CustomerID != customerID {
		return fmt.Errorf("unauthorized")
	}

	if order.Status != "pending" {
		return fmt.Errorf("can only cancel pending orders")
	}

	return s.repo.UpdateStatus(ctx, orderID, "cancelled")
}

func (s *service) enrichOrders(ctx context.Context, orders []Order) ([]OrderResponse, error) {
	var responses []OrderResponse
	for _, order := range orders {
		items, err := s.repo.FindItemsByOrderID(ctx, order.ID)
		if err != nil {
			return nil, err
		}

		response := ToOrderResponse(&order)
		var orderItems []OrderItemResponse
		for _, item := range items {
			orderItems = append(orderItems, OrderItemResponse{
				ID:       item.ID,
				MenuID:   item.MenuID,
				Quantity: item.Quantity,
				Price:    item.Price,
			})
		}
		response.Items = orderItems
		responses = append(responses, response)
	}

	return responses, nil
}
