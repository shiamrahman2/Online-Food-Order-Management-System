package dashboard

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	GetStats(ctx context.Context) (*Stats, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

type Stats struct {
	TotalCustomers      int     `json:"total_customers"`
	TotalRestaurants    int     `json:"total_restaurants"`
	TotalDeliveryPersons int    `json:"total_delivery_persons"`
	TotalOrders         int     `json:"total_orders"`
	TotalRevenue        float64 `json:"total_revenue"`
	PendingOrders       int     `json:"pending_orders"`
	CompletedOrders     int     `json:"completed_orders"`
}

func (r *repository) GetStats(ctx context.Context) (*Stats, error) {
	stats := &Stats{}

	// Total customers
	err := database.DB.QueryRow(ctx, `SELECT COUNT(*) FROM customer`).Scan(&stats.TotalCustomers)
	if err != nil {
		return nil, fmt.Errorf("failed to count customers: %w", err)
	}

	// Total restaurants
	err = database.DB.QueryRow(ctx, `SELECT COUNT(*) FROM restaurant`).Scan(&stats.TotalRestaurants)
	if err != nil {
		return nil, fmt.Errorf("failed to count restaurants: %w", err)
	}

	// Total delivery persons
	err = database.DB.QueryRow(ctx, `SELECT COUNT(*) FROM d_person`).Scan(&stats.TotalDeliveryPersons)
	if err != nil {
		return nil, fmt.Errorf("failed to count delivery persons: %w", err)
	}

	// Total orders
	err = database.DB.QueryRow(ctx, `SELECT COUNT(*) FROM orders`).Scan(&stats.TotalOrders)
	if err != nil {
		return nil, fmt.Errorf("failed to count orders: %w", err)
	}

	// Total revenue (from paid payments)
	err = database.DB.QueryRow(ctx, `
		SELECT COALESCE(SUM(amount), 0) FROM payment WHERE payment_status = 'paid'
	`).Scan(&stats.TotalRevenue)
	if err != nil {
		return nil, fmt.Errorf("failed to calculate revenue: %w", err)
	}

	// Pending orders
	err = database.DB.QueryRow(ctx, `
		SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'accepted', 'preparing', 'ready', 'assigned', 'picked_up', 'on_the_way')
	`).Scan(&stats.PendingOrders)
	if err != nil {
		return nil, fmt.Errorf("failed to count pending orders: %w", err)
	}

	// Completed orders
	err = database.DB.QueryRow(ctx, `
		SELECT COUNT(*) FROM orders WHERE status = 'delivered'
	`).Scan(&stats.CompletedOrders)
	if err != nil {
		return nil, fmt.Errorf("failed to count completed orders: %w", err)
	}

	return stats, nil
}