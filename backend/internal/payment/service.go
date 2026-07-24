package payment

import (
	"context"
	"fmt"
)

type Service interface {
	Create(ctx context.Context, req *CreatePaymentRequest) (*PaymentResponse, error)
	GetByID(ctx context.Context, id int) (*PaymentResponse, error)
	GetByOrderID(ctx context.Context, orderID int) (*PaymentResponse, error)
	UpdateStatus(ctx context.Context, id int, req *UpdatePaymentStatusRequest) error
	GetAllPayments(ctx context.Context) ([]PaymentResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, req *CreatePaymentRequest) (*PaymentResponse, error) {
	validMethods := map[string]bool{
		"cash":   true,
		"card":   true,
		"bkash":  true,
		"nagad":  true,
		"rocket": true,
	}

	if !validMethods[req.PaymentMethod] {
		return nil, fmt.Errorf("invalid payment method")
	}

	payment := &Payment{
		OrderID:       req.OrderID,
		Amount:        req.Amount,
		PaymentMethod: req.PaymentMethod,
		PaymentStatus: "pending",
	}

	createdPayment, err := s.repo.Create(ctx, payment)
	if err != nil {
		return nil, err
	}

	response := ToPaymentResponse(createdPayment)
	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id int) (*PaymentResponse, error) {
	payment, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToPaymentResponse(payment)
	return &response, nil
}

func (s *service) GetByOrderID(ctx context.Context, orderID int) (*PaymentResponse, error) {
	payment, err := s.repo.FindByOrderID(ctx, orderID)
	if err != nil {
		return nil, err
	}

	response := ToPaymentResponse(payment)
	return &response, nil
}

func (s *service) UpdateStatus(ctx context.Context, id int, req *UpdatePaymentStatusRequest) error {
	validStatuses := map[string]bool{
		"pending":  true,
		"paid":     true,
		"failed":   true,
		"refunded": true,
	}

	if !validStatuses[req.PaymentStatus] {
		return fmt.Errorf("invalid payment status")
	}

	return s.repo.UpdateStatus(ctx, id, req.PaymentStatus, req.TransactionID)
}

func (s *service) GetAllPayments(ctx context.Context) ([]PaymentResponse, error) {
	payments, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var responses []PaymentResponse
	for _, p := range payments {
		responses = append(responses, ToPaymentResponse(&p))
	}

	return responses, nil
}
