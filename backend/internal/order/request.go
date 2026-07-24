package order

type CreateOrderRequest struct {
	RestaurantID    int               `json:"restaurant_id"`
	DeliveryAddress string            `json:"delivery_address"`
	Notes           string            `json:"notes"`
	Items           []OrderItemRequest `json:"items"`
	PaymentMethod   string            `json:"payment_method"`
}

type OrderItemRequest struct {
	MenuID   int `json:"menu_id"`
	Quantity int `json:"quantity"`
}

type UpdateOrderStatusRequest struct {
	Status string `json:"status"`
}

type AssignDeliveryPersonRequest struct {
	DeliveryPersonID int `json:"delivery_person_id"`
}