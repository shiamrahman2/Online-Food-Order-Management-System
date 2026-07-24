package restaurant

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, r *Restaurant) (*Restaurant, error)
	FindByID(ctx context.Context, id int) (*Restaurant, error)
	FindByEmail(ctx context.Context, email string) (*Restaurant, error)
	Update(ctx context.Context, r *Restaurant) (*Restaurant, error)
	Delete(ctx context.Context, id int) error
	FindAll(ctx context.Context) ([]Restaurant, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, res *Restaurant) (*Restaurant, error) {
	query := `
		INSERT INTO restaurant (name, password, description, address, phone, email, logo, is_active)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		res.Name, res.Password, res.Description, res.Address,
		res.Phone, res.Email, res.Logo, res.IsActive,
	).Scan(&res.ID, &res.CreatedAt, &res.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create restaurant: %w", err)
	}

	return res, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Restaurant, error) {
	query := `
		SELECT id, name, password, description, address, phone, email, logo, is_active, created_at, updated_at
		FROM restaurant
		WHERE id = $1
	`
	res := &Restaurant{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&res.ID, &res.Name, &res.Password, &res.Description,
		&res.Address, &res.Phone, &res.Email, &res.Logo,
		&res.IsActive, &res.CreatedAt, &res.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("restaurant not found: %w", err)
	}

	return res, nil
}

func (r *repository) FindByEmail(ctx context.Context, email string) (*Restaurant, error) {
	query := `
		SELECT id, name, password, description, address, phone, email, logo, is_active, created_at, updated_at
		FROM restaurant
		WHERE email = $1
	`
	res := &Restaurant{}
	err := database.DB.QueryRow(ctx, query, email).Scan(
		&res.ID, &res.Name, &res.Password, &res.Description,
		&res.Address, &res.Phone, &res.Email, &res.Logo,
		&res.IsActive, &res.CreatedAt, &res.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("restaurant not found: %w", err)
	}

	return res, nil
}

// func (r *repository) Update(ctx context.Context, res *Restaurant) (*Restaurant, error) {
// 	query := `
// 		UPDATE restaurant
// 		SET name = $1, description = $2, address = $3, phone = $4, logo = $5, password = $6, updated_at = CURRENT_TIMESTAMP
// 		WHERE id = $7
// 		RETURNING updated_at
// 	`
// 	err := database.DB.QueryRow(ctx, query,
// 		res.Name, res.Description, res.Address, res.Phone,
// 		res.Logo, res.Password, res.ID,
// 	).Scan(&res.UpdatedAt)

// 	if err != nil {
// 		return nil, fmt.Errorf("failed to update restaurant: %w", err)
// 	}

// 	return res, nil
// }
func (r *repository) Update(ctx context.Context, res *Restaurant) (*Restaurant, error) {
	query := `
		UPDATE restaurant
		SET 
			name = $1,
			description = $2,
			address = $3,
			phone = $4,
			logo = $5,
			email = $6,
			password = $7,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
		RETURNING updated_at
	`

	err := database.DB.QueryRow(ctx, query,
		res.Name,
		res.Description,
		res.Address,
		res.Phone,
		res.Logo,
		res.Email,
		res.Password,
		res.ID,
	).Scan(&res.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update restaurant: %w", err)
	}

	return res, nil
}
func (r *repository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM restaurant WHERE id = $1`
	_, err := database.DB.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete restaurant: %w", err)
	}
	return nil
}

func (r *repository) FindAll(ctx context.Context) ([]Restaurant, error) {
	query := `
		SELECT id, name, password, description, address, phone, email, logo, is_active, created_at, updated_at
		FROM restaurant
		ORDER BY id DESC
	`
	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch restaurants: %w", err)
	}
	defer rows.Close()

	var restaurants []Restaurant
	for rows.Next() {
		var res Restaurant
		err := rows.Scan(
			&res.ID, &res.Name, &res.Password, &res.Description,
			&res.Address, &res.Phone, &res.Email, &res.Logo,
			&res.IsActive, &res.CreatedAt, &res.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan restaurant: %w", err)
		}
		restaurants = append(restaurants, res)
	}

	return restaurants, nil
}