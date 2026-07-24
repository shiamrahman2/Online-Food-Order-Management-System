package admin

import "time"

type AdminResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	Role      string    `json:"role"`
	IsActive  bool      `json:"is_active"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type LoginResponse struct {
	Token string        `json:"token"`
	Admin AdminResponse `json:"admin"`
}

func ToAdminResponse(a *Admin) AdminResponse {
	return AdminResponse{
		ID:        a.ID,
		Name:      a.Name,
		Email:     a.Email,
		Phone:     a.Phone,
		Role:      a.Role,
		IsActive:  a.IsActive,
		CreatedAt: a.CreatedAt,
		UpdatedAt: a.UpdatedAt,
	}
}