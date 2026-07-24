package menu

import "time"

type MenuResponse struct {
	ID           int       `json:"id"`
	RestaurantID int       `json:"restaurant_id"`
	Name         string    `json:"name"`
	Description  string    `json:"description"`
	Price        float64   `json:"price"`
	Category     string    `json:"category"`
	Image        string    `json:"image"`
	IsAvailable  bool      `json:"is_available"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

func ToMenuResponse(m *Menu) MenuResponse {
	return MenuResponse{
		ID:           m.ID,
		RestaurantID: m.RestaurantID,
		Name:         m.Name,
		Description:  m.Description,
		Price:        m.Price,
		Category:     m.Category,
		Image:        m.Image,
		IsAvailable:  m.IsAvailable,
		CreatedAt:    m.CreatedAt,
		UpdatedAt:    m.UpdatedAt,
	}
}