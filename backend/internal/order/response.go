package order

import "time"

type OrderResponse struct {
	ID               int                 `json:"id"`
	CustomerID       int                 `json:"customer_id"`
	RestaurantID     int                 `json:"restaurant_id"`
	DeliveryPersonID *int                `json:"delivery_person_id"`
	TotalAmount      float64             `json:"total_amount"`
	Status           string              `json:"status"`
	DeliveryAddress  string              `json:"delivery_address"`
	Notes            string              `json:"notes"`
	Items            []OrderItemResponse `json:"items"`
	CreatedAt        time.Time           `json:"created_at"`
	UpdatedAt        time.Time           `json:"updated_at"`
}

type OrderItemResponse struct {
	ID       int     `json:"id"`
	MenuID   int     `json:"menu_id"`
	Quantity int     `json:"quantity"`
	Price    float64 `json:"price"`
}

func ToOrderResponse(o *Order) OrderResponse {
	return OrderResponse{
		ID:               o.ID,
		CustomerID:       o.CustomerID,
		RestaurantID:     o.RestaurantID,
		DeliveryPersonID: o.DeliveryPersonID,
		TotalAmount:      o.TotalAmount,
		Status:           o.Status,
		DeliveryAddress:  o.DeliveryAddress,
		Notes:            o.Notes,
		CreatedAt:        o.CreatedAt,
		UpdatedAt:        o.UpdatedAt,
	}
}
