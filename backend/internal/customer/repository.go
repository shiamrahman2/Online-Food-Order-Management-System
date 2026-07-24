package customer

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, c *Customer) (*Customer, error)
	FindByEmail(ctx context.Context, email string) (*Customer, error)
	FindByID(ctx context.Context, id int) (*Customer, error)
	Update(ctx context.Context, c *Customer) (*Customer, error)
	FindAll(ctx context.Context) ([]Customer, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, c *Customer) (*Customer, error) {
	query := `
		INSERT INTO customer (name, email, phone, password, address, is_active)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		c.Name, c.Email, c.Phone, c.Password, c.Address, c.IsActive,
	).Scan(&c.ID, &c.CreatedAt, &c.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create customer: %w", err)
	}

	return c, nil
}

func (r *repository) FindByEmail(ctx context.Context, email string) (*Customer, error) {
	query := `
		SELECT id, name, email, phone, password, address, is_active, created_at, updated_at
		FROM customer
		WHERE email = $1
	`
	c := &Customer{}
	err := database.DB.QueryRow(ctx, query, email).Scan(
		&c.ID, &c.Name, &c.Email, &c.Phone, &c.Password,
		&c.Address, &c.IsActive, &c.CreatedAt, &c.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("customer not found: %w", err)
	}

	return c, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Customer, error) {
	query := `
		SELECT id, name, email, phone, password, address, is_active, created_at, updated_at
		FROM customer
		WHERE id = $1
	`
	c := &Customer{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&c.ID, &c.Name, &c.Email, &c.Phone, &c.Password,
		&c.Address, &c.IsActive, &c.CreatedAt, &c.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("customer not found: %w", err)
	}

	return c, nil
}

// func (r *repository) Update(ctx context.Context, c *Customer) (*Customer, error) {
// 	query := `
// 		UPDATE customer
// 		SET name = $1, phone = $2, address = $3, password = $4, updated_at = CURRENT_TIMESTAMP
// 		WHERE id = $5
// 		RETURNING updated_at
// 	`
// 	err := database.DB.QueryRow(ctx, query,
// 		c.Name, c.Phone, c.Address, c.Password, c.ID,
// 	).Scan(&c.UpdatedAt)

// 	if err != nil {
// 		return nil, fmt.Errorf("failed to update customer: %w", err)
// 	}

// 	return c, nil
// }
func (r *repository) Update(ctx context.Context, c *Customer) (*Customer, error) {
	query := `
		UPDATE customer
		SET name = $1, email = $2, phone = $3, address = $4, password = $5, updated_at = CURRENT_TIMESTAMP
		WHERE id = $6
		RETURNING updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		c.Name,c.Email, c.Phone, c.Address, c.Password, c.ID,
	).Scan(&c.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update customer: %w", err)
	}

	return c, nil
}
func (r *repository) FindAll(ctx context.Context) ([]Customer, error) {
	query := `
		SELECT id, name, email, phone, password, address, is_active, created_at, updated_at
		FROM customer
		ORDER BY id DESC
	`
	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch customers: %w", err)
	}
	defer rows.Close()

	var customers []Customer
	for rows.Next() {
		var c Customer
		err := rows.Scan(
			&c.ID, &c.Name, &c.Email, &c.Phone, &c.Password,
			&c.Address, &c.IsActive, &c.CreatedAt, &c.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan customer: %w", err)
		}
		customers = append(customers, c)
	}

	return customers, nil
}