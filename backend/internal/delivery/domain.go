package delivery

import "time"

type DeliveryPerson struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	Phone         string    `json:"phone"`
	Password      string    `json:"-"`
	VehicleType   string    `json:"vehicle_type"`
	VehicleNumber string    `json:"vehicle_number"`
	IsAvailable   bool      `json:"is_available"`
	//IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}