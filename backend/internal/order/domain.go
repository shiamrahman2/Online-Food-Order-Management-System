package order

import "time"

type Order struct {
	ID               int       `json:"id"`
	CustomerID       int       `json:"customer_id"`
	RestaurantID     int       `json:"restaurant_id"`
	DeliveryPersonID *int      `json:"delivery_person_id"`
	TotalAmount      float64   `json:"total_amount"`
	Status           string    `json:"status"`
	DeliveryAddress  string    `json:"delivery_address"`
	Notes            string    `json:"notes"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type OrderItem struct {
	ID        int       `json:"id"`
	OrderID   int       `json:"order_id"`
	MenuID    int       `json:"menu_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"created_at"`
}