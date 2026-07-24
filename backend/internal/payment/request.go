package payment

type CreatePaymentRequest struct {
	OrderID       int     `json:"order_id"`
	Amount        float64 `json:"amount"`
	PaymentMethod string  `json:"payment_method"`
}

type UpdatePaymentStatusRequest struct {
	PaymentStatus string `json:"payment_status"`
	TransactionID string `json:"transaction_id"`
}