package menu

import (
	"context"
	"fmt"

	"food-order-management/pkg/utils"
)

type Service interface {
	Create(ctx context.Context, req *CreateMenuRequest, restaurantID int) (*MenuResponse, error)
	GetByID(ctx context.Context, id int) (*MenuResponse, error)
	Update(ctx context.Context, id int, req *UpdateMenuRequest, restaurantID int) (*MenuResponse, error)
	Delete(ctx context.Context, id int, restaurantID int) error
	GetByRestaurantID(ctx context.Context, restaurantID int) ([]MenuResponse, error)
	Search(ctx context.Context, query string) ([]MenuResponse, error)
}

type service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return &service{repo: repo}
}

func (s *service) Create(ctx context.Context, req *CreateMenuRequest, restaurantID int) (*MenuResponse, error) {
	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidatePrice(req.Price) {
		return nil, fmt.Errorf("price must be greater than 0")
	}

	menu := &Menu{
		RestaurantID: restaurantID,
		Name:         req.Name,
		Description:  req.Description,
		Price:        req.Price,
		Category:     req.Category,
		Image:        req.Image,
		IsAvailable:  true,
	}

	createdMenu, err := s.repo.Create(ctx, menu)
	if err != nil {
		return nil, err
	}

	response := ToMenuResponse(createdMenu)
	return &response, nil
}

func (s *service) GetByID(ctx context.Context, id int) (*MenuResponse, error) {
	menu, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	response := ToMenuResponse(menu)
	return &response, nil
}

func (s *service) Update(ctx context.Context, id int, req *UpdateMenuRequest, restaurantID int) (*MenuResponse, error) {
	menu, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if menu.RestaurantID != restaurantID {
		return nil, fmt.Errorf("unauthorized to update this menu")
	}

	if !utils.ValidateRequired(req.Name) {
		return nil, fmt.Errorf("name is required")
	}
	if !utils.ValidatePrice(req.Price) {
		return nil, fmt.Errorf("price must be greater than 0")
	}

	menu.Name = req.Name
	menu.Description = req.Description
	menu.Price = req.Price
	menu.Category = req.Category
	menu.Image = req.Image
	menu.IsAvailable = req.IsAvailable

	updatedMenu, err := s.repo.Update(ctx, menu)
	if err != nil {
		return nil, err
	}

	response := ToMenuResponse(updatedMenu)
	return &response, nil
}

func (s *service) Delete(ctx context.Context, id int, restaurantID int) error {
	menu, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return err
	}

	if menu.RestaurantID != restaurantID {
		return fmt.Errorf("unauthorized to delete this menu")
	}

	return s.repo.Delete(ctx, id)
}

func (s *service) GetByRestaurantID(ctx context.Context, restaurantID int) ([]MenuResponse, error) {
	menus, err := s.repo.FindByRestaurantID(ctx, restaurantID)
	if err != nil {
		return nil, err
	}

	var responses []MenuResponse
	for _, m := range menus {
		responses = append(responses, ToMenuResponse(&m))
	}

	return responses, nil
}

func (s *service) Search(ctx context.Context, query string) ([]MenuResponse, error) {
	menus, err := s.repo.Search(ctx, query)
	if err != nil {
		return nil, err
	}

	var responses []MenuResponse
	for _, m := range menus {
		responses = append(responses, ToMenuResponse(&m))
	}

	return responses, nil
}