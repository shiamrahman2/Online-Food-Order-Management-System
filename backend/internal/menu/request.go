package menu

type CreateMenuRequest struct {
	RestaurantID int     `json:"restaurant_id"`
	Name         string  `json:"name"`
	Description  string  `json:"description"`
	Price        float64 `json:"price"`
	Category     string  `json:"category"`
	Image        string  `json:"image"`
}

type UpdateMenuRequest struct {
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Category    string  `json:"category"`
	Image       string  `json:"image"`
	IsAvailable bool    `json:"is_available"`
}