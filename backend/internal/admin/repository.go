package admin

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, admin *Admin) (*Admin, error)
	FindByEmail(ctx context.Context, email string) (*Admin, error)
	FindByID(ctx context.Context, id int) (*Admin, error)
	Update(ctx context.Context, admin *Admin) (*Admin, error)
	Count(ctx context.Context) (int, error)
	UpdatePassword(ctx context.Context, id int, hashedPassword string) error
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, admin *Admin) (*Admin, error) {
	query := `
		INSERT INTO admin (name, email, phone, password, role, is_active)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		admin.Name,
		admin.Email,
		admin.Phone,
		admin.Password,
		admin.Role,
		admin.IsActive,
	).Scan(&admin.ID, &admin.CreatedAt, &admin.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create admin: %w", err)
	}

	return admin, nil
}

func (r *repository) FindByEmail(ctx context.Context, email string) (*Admin, error) {
	query := `
		SELECT id, name, email, phone, password, role, is_active, created_at, updated_at
		FROM admin
		WHERE email = $1
	`
	admin := &Admin{}
	err := database.DB.QueryRow(ctx, query, email).Scan(
		&admin.ID,
		&admin.Name,
		&admin.Email,
		&admin.Phone,
		&admin.Password,
		&admin.Role,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("admin not found: %w", err)
	}

	return admin, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Admin, error) {
	query := `
		SELECT id, name, email, phone, password, role, is_active, created_at, updated_at
		FROM admin
		WHERE id = $1
	`
	admin := &Admin{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&admin.ID,
		&admin.Name,
		&admin.Email,
		&admin.Phone,
		&admin.Password,
		&admin.Role,
		&admin.IsActive,
		&admin.CreatedAt,
		&admin.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("admin not found: %w", err)
	}

	return admin, nil
}
func (r *repository) UpdatePassword(ctx context.Context, id int, hashedPassword string) error {
    query := `
        UPDATE admin
        SET password = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
    `
    _, err := database.DB.Exec(ctx, query, hashedPassword, id)
    if err != nil {
        return fmt.Errorf("failed to update password: %w", err)
    }
    return nil
}
func (r *repository) Update(ctx context.Context, admin *Admin) (*Admin, error) {
	query := `
		UPDATE admin
		SET name = $1, phone = $2, email=$3, updated_at = CURRENT_TIMESTAMP
		WHERE id = $4
		RETURNING updated_at
	`
	err := database.DB.QueryRow(ctx, query, admin.Name, admin.Phone, admin.Email, admin.ID).Scan(&admin.UpdatedAt)
	if err != nil {
		return nil, fmt.Errorf("failed to update admin: %w", err)
	}

	return admin, nil
}

func (r *repository) Count(ctx context.Context) (int, error) {
	var count int
	query := `SELECT COUNT(*) FROM admin`
	err := database.DB.QueryRow(ctx, query).Scan(&count)
	if err != nil {
		return 0, fmt.Errorf("failed to count admin: %w", err)
	}
	return count, nil
}
