package delivery

import (
	"context"
	"fmt"

	"food-order-management/pkg/database"
)

type Repository interface {
	Create(ctx context.Context, d *DeliveryPerson) (*DeliveryPerson, error)
	FindByID(ctx context.Context, id int) (*DeliveryPerson, error)
	FindByEmail(ctx context.Context, email string) (*DeliveryPerson, error)
	Update(ctx context.Context, d *DeliveryPerson) (*DeliveryPerson, error)
	Delete(ctx context.Context, id int) error
	FindAll(ctx context.Context) ([]DeliveryPerson, error)
	UpdateAvailability(ctx context.Context, id int, available bool) error
}

type repository struct{}

func NewRepository() Repository {
	return &repository{}
}

func (r *repository) Create(ctx context.Context, d *DeliveryPerson) (*DeliveryPerson, error) {
	query := `
		INSERT INTO d_person (name, email, phone, password, vehicle_type, vehicle_number, is_available)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING id, created_at, updated_at
	`
	err := database.DB.QueryRow(ctx, query,
		d.Name, d.Email, d.Phone, d.Password,
		d.VehicleType, d.VehicleNumber, d.IsAvailable,
	).Scan(&d.ID, &d.CreatedAt, &d.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to create delivery person: %w", err)
	}

	return d, nil
}

func (r *repository) FindByID(ctx context.Context, id int) (*DeliveryPerson, error) {
	query := `
		SELECT id, name, email, phone, password, vehicle_type, vehicle_number, is_available, created_at, updated_at
		FROM d_person
		WHERE id = $1
	`
	d := &DeliveryPerson{}
	err := database.DB.QueryRow(ctx, query, id).Scan(
		&d.ID, &d.Name, &d.Email, &d.Phone, &d.Password,
		&d.VehicleType, &d.VehicleNumber, &d.IsAvailable,
		&d.CreatedAt, &d.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("delivery person not found: %w", err)
	}

	return d, nil
}

func (r *repository) FindByEmail(ctx context.Context, email string) (*DeliveryPerson, error) {
	query := `
		SELECT id, name, email, phone, password, vehicle_type, vehicle_number, is_available, created_at, updated_at
		FROM d_person
		WHERE email = $1
	`
	d := &DeliveryPerson{}
	err := database.DB.QueryRow(ctx, query, email).Scan(
		&d.ID, &d.Name, &d.Email, &d.Phone, &d.Password,
		&d.VehicleType, &d.VehicleNumber, &d.IsAvailable,
		&d.CreatedAt, &d.UpdatedAt,
	)

	if err != nil {
		return nil, fmt.Errorf("delivery person not found: %w", err)
	}

	return d, nil
}

func (r *repository) Update(ctx context.Context, d *DeliveryPerson) (*DeliveryPerson, error) {
	query := `
		UPDATE d_person
		SET 
			name = $1,
			email = $2,
			phone = $3,
			vehicle_type = $4,
			vehicle_number = $5,
			is_available = $6,
			password = $7,
			updated_at = CURRENT_TIMESTAMP
		WHERE id = $8
		RETURNING updated_at
	`

	err := database.DB.QueryRow(ctx, query,
		d.Name,
		d.Email,
		d.Phone,
		d.VehicleType,
		d.VehicleNumber,
		d.IsAvailable,
		d.Password,
		d.ID,
	).Scan(&d.UpdatedAt)

	if err != nil {
		return nil, fmt.Errorf("failed to update delivery person: %w", err)
	}

	return d, nil
}

func (r *repository) Delete(ctx context.Context, id int) error {
	query := `DELETE FROM d_person WHERE id = $1`
	_, err := database.DB.Exec(ctx, query, id)
	if err != nil {
		return fmt.Errorf("failed to delete delivery person: %w", err)
	}
	return nil
}

func (r *repository) FindAll(ctx context.Context) ([]DeliveryPerson, error) {
	query := `
		SELECT id, name, email, phone, password, vehicle_type, vehicle_number, is_available, created_at, updated_at
		FROM d_person
		ORDER BY id DESC
	`
	rows, err := database.DB.Query(ctx, query)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch delivery persons: %w", err)
	}
	defer rows.Close()

	var persons []DeliveryPerson
	for rows.Next() {
		var d DeliveryPerson
		err := rows.Scan(
			&d.ID, &d.Name, &d.Email, &d.Phone, &d.Password,
			&d.VehicleType, &d.VehicleNumber, &d.IsAvailable,
			&d.CreatedAt, &d.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan delivery person: %w", err)
		}
		persons = append(persons, d)
	}

	return persons, nil
}

func (r *repository) UpdateAvailability(ctx context.Context, id int, available bool) error {
	query := `UPDATE d_person SET is_available = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`
	_, err := database.DB.Exec(ctx, query, available, id)
	if err != nil {
		return fmt.Errorf("failed to update availability: %w", err)
	}
	return nil
}