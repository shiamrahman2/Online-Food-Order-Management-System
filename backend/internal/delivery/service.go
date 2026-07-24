package delivery

import (
	"context"
	"fmt"

	"food-order-management/pkg/utils"
)

type Service interface {
	Create(ctx context.Context, req *CreateDeliveryPersonRequest) (*DeliveryPersonResponse, error)
	Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error)
	GetProfile(ctx context.Context, id int) (*DeliveryPersonResponse, error)
	UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*DeliveryPersonResponse, error)
	ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error
	Delete(ctx context.Context, id int) error
	GetAll(ctx context.Context) ([]DeliveryPersonResponse, error)
	UpdateAvailability(ctx context.Context, id int, available bool) error
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, req *CreateDeliveryPersonRequest) (*DeliveryPersonResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		return nil, fmt.Errorf("%s", msg)
	}

	existingPerson, _ := s.repo.FindByEmail(ctx, req.Email)
	if existingPerson != nil {
		return nil, fmt.Errorf("email already registered")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password")
	}

	person := &DeliveryPerson{
		Name:          req.Name,
		Email:         req.Email,
		Phone:         req.Phone,
		Password:      hashedPassword,
		VehicleType:   req.VehicleType,
		VehicleNumber: req.VehicleNumber,
		IsAvailable:   true,
		IsActive:      true,
	}

	createdPerson, err := s.repo.Create(ctx, person)
	if err != nil {
		return nil, err
	}

	response := ToDeliveryPersonResponse(createdPerson)
	return &response, nil
}

func (s *service) Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}

	person, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !utils.CheckPassword(req.Password, person.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !person.IsActive {
		return nil, fmt.Errorf("account is deactivated")
	}

	token, err := utils.GenerateToken(person.ID, "delivery", jwtSecret, jwtExp)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token")
	}

	response := &LoginResponse{
		Token:          token,
		DeliveryPerson: ToDeliveryPersonResponse(person),
	}

	return response, nil
}

func (s *service) GetProfile(ctx context.Context, id int) (*DeliveryPersonResponse, error) {
	person, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToDeliveryPersonResponse(person)
	return &response, nil
}

func (s *service) UpdateProfile(ctx context.Context, id int, req *UpdateProfileRequest) (*DeliveryPersonResponse, error) {
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
    if !utils.ValidateEmail(req.Email){
		return nil, fmt.Errorf("invalid Email format")
	}
	person, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	person.Name = req.Name
	person.Phone = req.Phone
	person.Email=req.Email
	person.VehicleType = req.VehicleType
	person.VehicleNumber = req.VehicleNumber
	person.IsAvailable = req.IsAvailable

	updatedPerson, err := s.repo.Update(ctx, person)
	if err != nil {
		return nil, err
	}

	response := ToDeliveryPersonResponse(updatedPerson)
	return &response, nil
}

func (s *service) ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error {
	if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
		return fmt.Errorf("%s", msg)
	}

	person, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if !utils.CheckPassword(req.OldPassword, person.Password) {
		return fmt.Errorf("current password is incorrect")
	}

	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password")
	}

	person.Password = hashedPassword
	_, err = s.repo.Update(ctx, person)
	return err
}

func (s *service) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

func (s *service) GetAll(ctx context.Context) ([]DeliveryPersonResponse, error) {
	persons, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var responses []DeliveryPersonResponse
	for _, p := range persons {
		responses = append(responses, ToDeliveryPersonResponse(&p))
	}

	return responses, nil
}

func (s *service) UpdateAvailability(ctx context.Context, id int, available bool) error {
	return s.repo.UpdateAvailability(ctx, id, available)
}
