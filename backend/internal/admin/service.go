package admin

import (
	"context"
	"fmt"

	"food-order-management/pkg/utils"
)

type Service interface {
	Register(ctx context.Context, req *RegisterRequest) (*AdminResponse, error)
	Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error)
	GetProfile(ctx context.Context, id int) (*AdminResponse, error)
	UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*AdminResponse, error)
	ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Register(ctx context.Context, req *RegisterRequest) (*AdminResponse, error) {
	// Validate
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		return nil, fmt.Errorf("%s", msg)
	}

	// Check if admin already exists
	count, err := s.repo.Count(ctx)
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, fmt.Errorf("admin already exists")
	}

	// Check email uniqueness
	existingAdmin, _ := s.repo.FindByEmail(ctx, req.Email)
	if existingAdmin != nil {
		return nil, fmt.Errorf("email already registered")
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password")
	}

	admin := &Admin{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: hashedPassword,
		Role:     "admin",
		IsActive: true,
	}

	createdAdmin, err := s.repo.Create(ctx, admin)
	if err != nil {
		return nil, err
	}

	response := ToAdminResponse(createdAdmin)
	return &response, nil
}

func (s *service) Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}

	admin, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !utils.CheckPassword(req.Password, admin.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !admin.IsActive {
		return nil, fmt.Errorf("account is deactivated")
	}

	token, err := utils.GenerateToken(admin.ID, admin.Role, jwtSecret, jwtExp)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token")
	}

	response := &LoginResponse{
		Token: token,
		Admin: ToAdminResponse(admin),
	}

	return response, nil
}

func (s *service) GetProfile(ctx context.Context, id int) (*AdminResponse, error) {
	admin, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToAdminResponse(admin)
	return &response, nil
}

func (s *service) UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*AdminResponse, error) {
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
    if !utils.ValidateEmail(req.Email){
		return nil, fmt.Errorf("invalid email format")
	}
	admin, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	admin.Name = req.Name
	admin.Email=req.Email
	admin.Phone = req.Phone

	updatedAdmin, err := s.repo.Update(ctx, admin)
	if err != nil {
		return nil, err
	}

	response := ToAdminResponse(updatedAdmin)
	return &response, nil
}

func (s *service) ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error {
    if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
        return fmt.Errorf("%s", msg)
    }

    admin, err := s.repo.FindByID(ctx, id)
    if err != nil {
        return err
    }

    if !utils.CheckPassword(req.OldPassword, admin.Password) {
        return fmt.Errorf("current password is incorrect")
    }

    hashedPassword, err := utils.HashPassword(req.NewPassword)
    if err != nil {
        return fmt.Errorf("failed to hash password")
    }

    return s.repo.UpdatePassword(ctx, id, hashedPassword)
}