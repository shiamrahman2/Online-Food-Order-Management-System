package payment

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, p *Payment) (*Payment, error)
	FindByID(ctx context.Context, id int) (*Payment, error)
	FindByOrderID(ctx context.Context, orderID int) (*Payment, error)
	UpdateStatus(ctx context.Context, id int, status string, transactionID string) error
	FindAll(ctx context.Context) ([]Payment, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, p *Payment) (*Payment, error) {
	query := `
		INSERT INTO payment (order_id, amount, payment_method, payment_status)
		VALUES ($1, $2, $3, $4)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		p.OrderID, p.Amount, p.PaymentMethod, p.PaymentStatus,
	).Scan(&p.ID, &p.CreatedAt, &p.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create payment: %w", err)
	}

	return p, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Payment, error) {
	query := `
		SELECT id, order_id, amount, payment_method, payment_status, COALESCE(transaction_id, '') AS transaction_id, created_at, updated_at
		FROM payment
		WHERE id = $1
	`
	p := &Payment{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&p.ID, &p.OrderID, &p.Amount, &p.PaymentMethod,
		&p.PaymentStatus, &p.TransactionID, &p.CreatedAt, &p.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}

	return p, nil
}

func (r *repository) FindByOrderID(ctx context.Context, orderID int) (*Payment, error) {
	query := `
		SELECT id, order_id, amount, payment_method, payment_status, COALESCE(transaction_id, '') AS transaction_id, created_at, updated_at
		FROM payment
		WHERE order_id = $1
	`
	p := &Payment{}
	err := database.DB.QueryRow(ctx, query, orderID).Scan(
		&p.ID, &p.OrderID, &p.Amount, &p.PaymentMethod,
		&p.PaymentStatus, &p.TransactionID, &p.CreatedAt, &p.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("payment not found: %w", err)
	}

	return p, nil
}

func (r *repository) UpdateStatus(ctx context.Context, id int, status string, transactionID string) error {
	query := `
		UPDATE payment
		SET payment_status = $1, transaction_id = $2, updated_at = CURRENT_TIMESTAMP
		WHERE id = $3
	`
	_, err := database.DB.Exec(ctx, query, status, transactionID, id)
	if err != nil {
		return fmt.Errorf("failed to update payment status: %w", err)
	}
	return nil
}

func (r *repository) FindAll(ctx context.Context) ([]Payment, error) {
	query := `
		SELECT id, order_id, amount, payment_method, payment_status, COALESCE(transaction_id, '') AS transaction_id, created_at, updated_at
		FROM payment
		ORDER BY created_at DESC
	`
	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch payments: %w", err)
	}
	defer rows.Close()

	var payments []Payment
	for rows.Next() {
		var p Payment
		err := rows.Scan(
			&p.ID, &p.OrderID, &p.Amount, &p.PaymentMethod,
			&p.PaymentStatus, &p.TransactionID, &p.CreatedAt, &p.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan payment: %w", err)
		}
		payments = append(payments, p)
	}

	return payments, nil
}
