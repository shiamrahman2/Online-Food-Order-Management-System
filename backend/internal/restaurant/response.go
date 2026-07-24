package restaurant

import "time"

type RestaurantResponse struct {
	ID          int       `json:"id"`
	Name        string    `json:"name"`
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

type LoginResponse struct {
	Token      string             `json:"token"`
	Restaurant RestaurantResponse `json:"restaurant"`
}

func ToRestaurantResponse(r *Restaurant) RestaurantResponse {
	return RestaurantResponse{
		ID:          r.ID,
		Name:        r.Name,
		Description: r.Description,
		Address:     r.Address,
		Phone:       r.Phone,
		Email:       r.Email,
		Logo:        r.Logo,
		IsActive:    r.IsActive,
		OwnerID:     r.OwnerID,
		CreatedAt:   r.CreatedAt,
		UpdatedAt:   r.UpdatedAt,
	}
}