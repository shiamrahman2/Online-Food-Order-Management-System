package restaurant

import (
	"context"
	"fmt"

	"food-order-management/pkg/utils"
)

type Service interface {
	Create(ctx context.Context, req *CreateRestaurantRequest) (*RestaurantResponse, error)
	Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error)
	GetProfile(ctx context.Context, id int) (*RestaurantResponse, error)
	UpdateProfile(ctx context.Context, id int, req *UpdateRestaurantRequest) (*RestaurantResponse, error)
	ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error
	Delete(ctx context.Context, id int) error
	GetAllRestaurants(ctx context.Context) ([]RestaurantResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, req *CreateRestaurantRequest) (*RestaurantResponse, error) {//, ownerID int
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
	if valid, msg := utils.ValidatePassword(req.Password); !valid {
		return nil, fmt.Errorf("%s", msg)
	}

	existingRestaurant, _ := s.repo.FindByEmail(ctx, req.Email)
	if existingRestaurant != nil {
		return nil, fmt.Errorf("email already registered")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to hash password")
	}

	restaurant := &Restaurant{
		Name:        req.Name,
		Password:    hashedPassword,
		Description: req.Description,
		Address:     req.Address,
		Phone:       req.Phone,
		Email:       req.Email,
		Logo:        req.Logo,
		IsActive:    true,
		//OwnerID:     ownerID,
	}

	createdRestaurant, err := s.repo.Create(ctx, restaurant)
	if err != nil {
		return nil, err
	}

	response := ToRestaurantResponse(createdRestaurant)
	return &response, nil
}

func (s *service) Login(ctx context.Context, req *LoginRequest, jwtSecret string, jwtExp int) (*LoginResponse, error) {
	if !utils.ValidateEmail(req.Email) {
		return nil, fmt.Errorf("invalid email format")
	}

	restaurant, err := s.repo.FindByEmail(ctx, req.Email)
	if err != nil {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !utils.CheckPassword(req.Password, restaurant.Password) {
		return nil, fmt.Errorf("invalid credentials")
	}

	if !restaurant.IsActive {
		return nil, fmt.Errorf("restaurant is deactivated")
	}

	token, err := utils.GenerateToken(restaurant.ID, "restaurant", jwtSecret, jwtExp)
	if err != nil {
		return nil, fmt.Errorf("failed to generate token")
	}

	response := &LoginResponse{
		Token:      token,
		Restaurant: ToRestaurantResponse(restaurant),
	}

	return response, nil
}

func (s *service) GetProfile(ctx context.Context, id int) (*RestaurantResponse, error) {
	restaurant, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToRestaurantResponse(restaurant)
	return &response, nil
}

func (s *service) UpdateProfile(ctx context.Context, id int, req *UpdateRestaurantRequest) (*RestaurantResponse, error) {
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidatePhone(req.Phone) {
		return nil, fmt.Errorf("invalid phone format")
	}
    if !utils.ValidateEmail(req.Email){
		return nil, fmt.Errorf("invalid email format")
	}
	restaurant, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	restaurant.Name = req.Name
	restaurant.Email=req.Email
	restaurant.Description = req.Description
	restaurant.Address = req.Address
	restaurant.Phone = req.Phone
	restaurant.Logo = req.Logo

	updatedRestaurant, err := s.repo.Update(ctx, restaurant)
	if err != nil {
		return nil, err
	}

	response := ToRestaurantResponse(updatedRestaurant)
	return &response, nil
}

func (s *service) ChangePassword(ctx context.Context, id int, req *ChangePasswordRequest) error {
	if valid, msg := utils.ValidatePassword(req.NewPassword); !valid {
		return fmt.Errorf("%s", msg)
	}

	restaurant, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if !utils.CheckPassword(req.OldPassword, restaurant.Password) {
		return fmt.Errorf("current password is incorrect")
	}

	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		return fmt.Errorf("failed to hash password")
	}

	restaurant.Password = hashedPassword
	_, err = s.repo.Update(ctx, restaurant)
	return err
}

func (s *service) Delete(ctx context.Context, id int) error {
	return s.repo.Delete(ctx, id)
}

func (s *service) GetAllRestaurants(ctx context.Context) ([]RestaurantResponse, error) {
	restaurants, err := s.repo.FindAll(ctx)
	if err != nil {
		return nil, err
	}

	var responses []RestaurantResponse
	for _, r := range restaurants {
		responses = append(responses, ToRestaurantResponse(&r))
	}

	return responses, nil
}