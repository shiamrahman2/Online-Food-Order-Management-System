package delivery

import "time"

type DeliveryPersonResponse struct {
	ID            int       `json:"id"`
	Name          string    `json:"name"`
	Email         string    `json:"email"`
	Phone         string    `json:"phone"`
	VehicleType   string    `json:"vehicle_type"`
	VehicleNumber string    `json:"vehicle_number"`
	IsAvailable   bool      `json:"is_available"`
	//IsActive      bool      `json:"is_active"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type LoginResponse struct {
	Token          string                  `json:"token"`
	DeliveryPerson DeliveryPersonResponse  `json:"delivery_person"`
}

func ToDeliveryPersonResponse(d *DeliveryPerson) DeliveryPersonResponse {
	return DeliveryPersonResponse{
		ID:            d.ID,
		Name:          d.Name,
		Email:         d.Email,
		Phone:         d.Phone,
		VehicleType:   d.VehicleType,
		VehicleNumber: d.VehicleNumber,
		IsAvailable:   d.IsAvailable,
		//IsActive:      d.IsActive,
		CreatedAt:     d.CreatedAt,
		UpdatedAt:     d.UpdatedAt,
	}
}