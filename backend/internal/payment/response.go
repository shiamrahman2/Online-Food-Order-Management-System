package payment

import "time"

type PaymentResponse struct {
	ID            int       `json:"id"`
	OrderID       int       `json:"order_id"`
	Amount        float64   `json:"amount"`
	PaymentMethod string    `json:"payment_method"`
	PaymentStatus string    `json:"payment_status"`
	TransactionID string    `json:"transaction_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

func ToPaymentResponse(p *Payment) PaymentResponse {
	return PaymentResponse{
		ID:            p.ID,
		OrderID:       p.OrderID,
		Amount:        p.Amount,
		PaymentMethod: p.PaymentMethod,
		PaymentStatus: p.PaymentStatus,
		TransactionID: p.TransactionID,
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
	}
}