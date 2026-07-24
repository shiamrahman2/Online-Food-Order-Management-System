package restaurant

import "time"

type Restaurant struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
	Password    string    `json:"-"`
	Description string    `json:"description"`
	Address     string    `json:"address"`
	Phone       string    `json:"phone"`
	Email       string    `json:"email"`
	Logo        string    `json:"logo"`
	IsActive    bool      `json:"is_active"`
	OwnerID     int       `json:"owner_id"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}