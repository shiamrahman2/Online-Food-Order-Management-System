package customer

import (
	"context"
	"fmt"

	"food-order-management/pkg/utils"
)

type Service interface {
	Register(ctx context.Context, req *RegisterRequest) (*CustomerResponse, error)
	Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error)
	GetProfile(ctx context.Context, id int) (*CustomerResponse, error)
	UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*CustomerResponse, error)
	ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error
	GetAllCustomers(ctx context.Context) ([]CustomerResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Register(ctx context.Context, req *RegisterRequest) (*CustomerResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		return nil, fmt.Errorf("%s", msg)
	}
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}

	existingCustomer, _ := s.repo.FindByEmail(ctx, req.Email)
	if existingCustomer != nil {
		return nil, fmt.Errorf("email already registered")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password")
	}

	customer := &Customer{
		Name:     req.Name,
		Email:    req.Email,
		Phone:    req.Phone,
		Password: hashedPassword,
		Address:  req.Address,
		IsActive: true,
	}

	createdCustomer, err := s.repo.Create(ctx, customer)
	if err != nil {
		return nil, err
	}

	response := ToCustomerResponse(createdCustomer)
	return &response, nil
}

func (s *service) Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}

	customer, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !utils.CheckPassword(req.Password, customer.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !customer.IsActive {
		return nil, fmt.Errorf("account is deactivated")
	}

	token, err := utils.GenerateToken(customer.ID, "customer", jwtSecret, jwtExp)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token")
	}

	response := &LoginResponse{
		Token:    token,
		Customer: ToCustomerResponse(customer),
	}

	return response, nil
}

func (s *service) GetProfile(ctx context.Context, id int) (*CustomerResponse, error) {
	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToCustomerResponse(customer)
	return &response, nil
}

func (s *service) UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*CustomerResponse, error) {
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}

	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	customer.Name = req.Name
	customer.Email = req.Email
	customer.Phone = req.Phone
	customer.Address = req.Address

	updatedCustomer, err := s.repo.Update(ctx, customer)
	if err != nil {
		return nil, err
	}

	response := ToCustomerResponse(updatedCustomer)
	return &response, nil
}

func (s *service) ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error {
	if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
		return fmt.Errorf("%s", msg)
	}

	customer, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if !utils.CheckPassword(req.OldPassword, customer.Password) {
		return fmt.Errorf("current password is incorrect")
	}

	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password")
	}

	customer.Password = hashedPassword
	_, err = s.repo.Update(ctx, customer)
	return err
}

func (s *service) GetAllCustomers(ctx context.Context) ([]CustomerResponse, error) {
	customers, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var responses []CustomerResponse
	for _, c := range customers {
		responses = append(responses, ToCustomerResponse(&c))
	}

	return responses, nil
}
