package order

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, o *Order) (*Order, error)
	CreateItem(ctx context.Context, item *OrderItem) (*OrderItem, error)
	FindByID(ctx context.Context, id int) (*Order, error)
	FindItemsByOrderID(ctx context.Context, orderID int) ([]OrderItem, error)
	UpdateStatus(ctx context.Context, id int, status string) error
	AssignDeliveryPerson(ctx context.Context, orderID int, deliveryPersonID int) error
	FindByCustomerID(ctx context.Context, customerID int) ([]Order, error)
	FindByRestaurantID(ctx context.Context, restaurantID int) ([]Order, error)
	FindByDeliveryPersonID(ctx context.Context, deliveryPersonID int) ([]Order, error)
	FindAll(ctx context.Context) ([]Order, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, o *Order) (*Order, error) {
	query := `
		INSERT INTO orders (customer_id, restaurant_id, total_amount, status, delivery_address, notes)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		o.CustomerID, o.RestaurantID, o.TotalAmount, o.Status,
		o.DeliveryAddress, o.Notes,
	).Scan(&o.ID, &o.CreatedAt, &o.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create order: %w", err)
	}

	return o, nil
}

func (r *repository) CreateItem(ctx context.Context, item *OrderItem) (*OrderItem, error) {
	query := `
		INSERT INTO order_items (order_id, menu_id, quantity, price)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at
	`
	err := database.DB.QueryRow(ctx, query,
		item.OrderID, item.MenuID, item.Quantity, item.Price,
	).Scan(&item.ID, &item.CreatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create order item: %w", err)
	}

	return item, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Order, error) {
	query := `
		SELECT id, customer_id, restaurant_id, delivery_person_id, total_amount, status, delivery_address, notes, created_at, updated_at
		FROM orders
		WHERE id = $1
	`
	o := &Order{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&o.ID, &o.CustomerID, &o.RestaurantID, &o.DeliveryPersonID,
		&o.TotalAmount, &o.Status, &o.DeliveryAddress, &o.Notes,
		&o.CreatedAt, &o.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("order not found: %w", err)
	}

	return o, nil
}

func (r *repository) FindItemsByOrderID(ctx context.Context, orderID int) ([]OrderItem, error) {
	query := `
		SELECT id, order_id, menu_id, quantity, price, created_at
		FROM order_items
		WHERE order_id = $1
	`
	rows, err := database.DB.Query(ctx, query, orderID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch order items: %w", err)
	}
	defer rows.Close()

	var items []OrderItem
	for rows.Next() {
		var item OrderItem
		err := rows.Scan(&item.ID, &item.OrderID, &item.MenuID, &item.Quantity, &item.Price, &item.CreatedAt)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order item: %w", err)
		}
		items = append(items, item)
	}

	return items, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id int, status string) error {
	query := `UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := database.DB.Exec(ctx, query, status, id)
	if err != nil {
		return fmt.Errorf("failed to update order status: %w", err)
	}
	return nil
}

func (r *repository) AssignDeliveryPerson(ctx context.Context, orderID int, deliveryPersonID int) error {
	query := `UPDATE orders SET delivery_person_id = $1, status = 'assigned', updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := database.DB.Exec(ctx, query, deliveryPersonID, orderID)
	if err != nil {
		return fmt.Errorf("failed to assign delivery person: %w", err)
	}
	return nil
}

func (r *repository) FindByCustomerID(ctx context.Context, customerID int) ([]Order, error) {
	query := `
		SELECT id, customer_id, restaurant_id, delivery_person_id, total_amount, status, delivery_address, notes, created_at, updated_at
		FROM orders
		WHERE customer_id = $1
		ORDER BY created_at DESC
	`
	return r.queryOrders(ctx, query, customerID)
}

func (r *repository) FindByRestaurantID(ctx context.Context, restaurantID int) ([]Order, error) {
	query := `
		SELECT id, customer_id, restaurant_id, delivery_person_id, total_amount, status, delivery_address, notes, created_at, updated_at
		FROM orders
		WHERE restaurant_id = $1
		ORDER BY created_at DESC
	`
	return r.queryOrders(ctx, query, restaurantID)
}

func (r *repository) FindByDeliveryPersonID(ctx context.Context, deliveryPersonID int) ([]Order, error) {
	query := `
		SELECT id, customer_id, restaurant_id, delivery_person_id, total_amount, status, delivery_address, notes, created_at, updated_at
		FROM orders
		WHERE delivery_person_id = $1
		ORDER BY created_at DESC
	`
	return r.queryOrders(ctx, query, deliveryPersonID)
}

func (r *repository) FindAll(ctx context.Context) ([]Order, error) {
	query := `
		SELECT id, customer_id, restaurant_id, delivery_person_id, total_amount, status, delivery_address, notes, created_at, updated_at
		FROM orders
		ORDER BY created_at DESC
	`
	return r.queryOrders(ctx, query)
}

func (r *repository) queryOrders(ctx context.Context, query string, args ...interface{}) ([]Order, error) {
	rows, err := database.DB.Query(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch orders: %w", err)
	}
	defer rows.Close()

	var orders []Order
	for rows.Next() {
		var o Order
		err := rows.Scan(
			&o.ID, &o.CustomerID, &o.RestaurantID, &o.DeliveryPersonID,
			&o.TotalAmount, &o.Status, &o.DeliveryAddress, &o.Notes,
			&o.CreatedAt, &o.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan order: %w", err)
		}
		orders = append(orders, o)
	}

	return orders, nil
}