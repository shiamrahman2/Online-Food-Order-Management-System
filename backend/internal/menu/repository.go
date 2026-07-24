package menu

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, m *Menu) (*Menu, error)
	FindByID(ctx context.Context, id int) (*Menu, error)
	Update(ctx context.Context, m *Menu) (*Menu, error)
	Delete(ctx context.Context, id int) error
	FindByRestaurantID(ctx context.Context, restaurantID int) ([]Menu, error)
	Search(ctx context.Context, query string) ([]Menu, error)
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, m *Menu) (*Menu, error) {
	query := `
		INSERT INTO menu (restaurant_id, name, description, price, category, image, is_available)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		m.RestaurantID, m.Name, m.Description, m.Price,
		m.Category, m.Image, m.IsAvailable,
	).Scan(&m.ID, &m.CreatedAt, &m.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create menu: %w", err)
	}

	return m, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*Menu, error) {
	query := `
		SELECT id, restaurant_id, name, description, price, category, image, is_available, created_at, updated_at
		FROM menu
		WHERE id = $1
	`
	m := &Menu{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&m.ID, &m.RestaurantID, &m.Name, &m.Description,
		&m.Price, &m.Category, &m.Image, &m.IsAvailable,
		&m.CreatedAt, &m.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("menu not found: %w", err)
	}

	return m, nil
}

func (r *repository) Update(ctx context.Context, m *Menu) (*Menu, error) {
	query := `
		UPDATE menu
		SET name = $1, description = $2, price = $3, category = $4, image = $5, is_available = $6, updated_at = CURRENT_TIMESTAMP
		WHERE id = $7
		RETURNING updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		m.Name, m.Description, m.Price, m.Category,
		m.Image, m.IsAvailable, m.ID,
	).Scan(&m.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update menu: %w", err)
	}

	return m, nil
}

func (r *repository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM menu WHERE id = $1`
	_, err := database.DB.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete menu: %w", err)
	}
	return nil
}

func (r *repository) FindByRestaurantID(ctx context.Context, restaurantID int) ([]Menu, error) {
	query := `
		SELECT id, restaurant_id, name, description, price, category, image, is_available, created_at, updated_at
		FROM menu
		WHERE restaurant_id = $1
		ORDER BY id DESC
	`
	rows, err := database.DB.Query(ctx, query, restaurantID)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch menus: %w", err)
	}
	defer rows.Close()

	var menus []Menu
	for rows.Next() {
		var m Menu
		err := rows.Scan(
			&m.ID, &m.RestaurantID, &m.Name, &m.Description,
			&m.Price, &m.Category, &m.Image, &m.IsAvailable,
			&m.CreatedAt, &m.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan menu: %w", err)
		}
		menus = append(menus, m)
	}

	return menus, nil
}

func (r *repository) Search(ctx context.Context, query string) ([]Menu, error) {
	searchQuery := "%" + query + "%"
	sql := `
		SELECT id, restaurant_id, name, description, price, category, image, is_available, created_at, updated_at
		FROM menu
		WHERE name ILIKE $1 OR description ILIKE $1 OR category ILIKE $1
		ORDER BY id DESC
	`
	rows, err := database.DB.Query(ctx, sql, searchQuery)
	if err != nil {
		return nil, fmt.Errorf("failed to search menus: %w", err)
	}
	defer rows.Close()

	var menus []Menu
	for rows.Next() {
		var m Menu
		err := rows.Scan(
			&m.ID, &m.RestaurantID, &m.Name, &m.Description,
			&m.Price, &m.Category, &m.Image, &m.IsAvailable,
			&m.CreatedAt, &m.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan menu: %w", err)
		}
		menus = append(menus, m)
	}

	return menus, nil
}