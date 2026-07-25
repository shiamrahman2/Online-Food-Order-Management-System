package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"food-order-management/config"
	"food-order-management/internal/admin"
	"food-order-management/internal/customer"
	"food-order-management/internal/dashboard"
	"food-order-management/internal/delivery"
	"food-order-management/internal/menu"
	"food-order-management/internal/order"
	"food-order-management/internal/payment"
	"food-order-management/internal/restaurant"
	"food-order-management/pkg/database"
	"food-order-management/pkg/router"
)

func main() {

	// Load configuration
	cfg := config.GetConfig()

	// Connect Database
	if err := database.Connect(cfg.DB); err != nil {
		log.Fatalf("Failed to connect database: %v", err)
	}
	defer database.Close()

	// Initialize repositories
	adminRepo := admin.NewRepository()
	customerRepo := customer.NewRepository()
	restaurantRepo := restaurant.NewRepository()
	menuRepo := menu.NewRepository()
	deliveryRepo := delivery.NewRepository()
	orderRepo := order.NewRepository()
	paymentRepo := payment.NewRepository()
	dashboardRepo := dashboard.NewRepository()

	// Initialize services
	adminService := admin.NewService(adminRepo)
	customerService := customer.NewService(customerRepo)
	restaurantService := restaurant.NewService(restaurantRepo)
	menuService := menu.NewService(menuRepo)
	deliveryService := delivery.NewService(deliveryRepo)
	orderService := order.NewService(orderRepo, menuRepo)
	paymentService := payment.NewService(paymentRepo)
	dashboardService := dashboard.NewService(dashboardRepo)

	// Initialize handlers
	adminHandler := admin.NewHandler(adminService, cfg)
	customerHandler := customer.NewHandler(customerService, cfg)
	restaurantHandler := restaurant.NewHandler(restaurantService, cfg)
	menuHandler := menu.NewHandler(menuService, cfg)
	deliveryHandler := delivery.NewHandler(deliveryService, cfg)
	orderHandler := order.NewHandler(orderService, cfg)
	paymentHandler := payment.NewHandler(paymentService, cfg)
	dashboardHandler := dashboard.NewHandler(dashboardService, cfg)

	// Register routes
	var routes []router.Route

	routes = append(routes, admin.Routes(adminHandler, cfg)...)
	routes = append(routes, customer.Routes(customerHandler, cfg)...)
	routes = append(routes, restaurant.Routes(restaurantHandler, cfg)...)
	routes = append(routes, menu.Routes(menuHandler, cfg)...)
	routes = append(routes, delivery.Routes(deliveryHandler, cfg)...)
	routes = append(routes, order.Routes(orderHandler, cfg)...)
	routes = append(routes, payment.Routes(paymentHandler, cfg)...)
	routes = append(routes, dashboard.Routes(dashboardHandler, cfg)...)

	handler := router.SetupRoutes(routes, cfg)

	log.Printf(
		"%s v%s started on :%d",
		cfg.ServiceName,
		cfg.Version,
		cfg.HttpPort,
	)

	if err := http.ListenAndServe(
		fmt.Sprintf(":%d", cfg.HttpPort),
		handler,
	); err != nil {
		log.Fatal(err)
		os.Exit(1)
	}
}
