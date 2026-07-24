// package config

// import (
// 	"os"
// 	"strconv"
// )

// type Config struct {
// 	ServerPort    string
// 	DatabaseURL   string
// 	JWTSecret     string
// 	JWTExpiration int
// }

// func LoadConfig() (*Config, error) {
// 	port := os.Getenv("SERVER_PORT")
// 	if port == "" {
// 		port = "8080"
// 	}

// 	dbURL := os.Getenv("DATABASE_URL")
// 	if dbURL == "" {
// 		dbURL = "postgres://postgres:postgres@localhost:5432/food_order?sslmode=disable"
// 	}

// 	jwtSecret := os.Getenv("JWT_SECRET")
// 	if jwtSecret == "" {
// 		jwtSecret = "your-secret-key-change-in-production"
// 	}

// 	jwtExpStr := os.Getenv("JWT_EXPIRATION")
// 	jwtExp := 24
// 	if jwtExpStr != "" {
// 		val, err := strconv.Atoi(jwtExpStr)
// 		if err == nil {
// 			jwtExp = val
// 		}
// 	}

// 	return &Config{
// 		ServerPort:    port,
// 		DatabaseURL:   dbURL,
// 		JWTSecret:     jwtSecret,
// 		JWTExpiration: jwtExp,
// 	}, nil
// }
package config

import (
	"fmt"
	"os"
	"strconv"
)

type DBConfig struct {
	Host          string
	Port          int
	User          string
	Password      string
	Name          string
	EnableSSLMode bool
}

type Config struct {
	Version       string
	ServiceName   string
	HttpPort      int
	JwtSecretKey  string
	JwtExpiration int
	DB            *DBConfig
}

var configuration *Config

func loadConfig() {

	if err := LoadEnv(".env"); err != nil {
		fmt.Println("Unable to load .env:", err)
		os.Exit(1)
	}

	version := os.Getenv("VERSION")
	if version == "" {
		fmt.Println("VERSION is required")
		os.Exit(1)
	}

	serviceName := os.Getenv("SERVICE_NAME")
	if serviceName == "" {
		fmt.Println("SERVICE_NAME is required")
		os.Exit(1)
	}

	httpPortStr := os.Getenv("HTTP_PORT")
	if httpPortStr == "" {
		fmt.Println("HTTP_PORT is required")
		os.Exit(1)
	}

	httpPort, err := strconv.Atoi(httpPortStr)
	if err != nil {
		fmt.Println("HTTP_PORT must be numeric")
		os.Exit(1)
	}

	jwtSecret := os.Getenv("JWT_SECRET_KEY")
	if jwtSecret == "" {
		fmt.Println("JWT_SECRET_KEY is required")
		os.Exit(1)
	}

	jwtExpirationStr := os.Getenv("JWT_EXPIRATION")
	if jwtExpirationStr == "" {
		fmt.Println("JWT_EXPIRATION is required")
		os.Exit(1)
	}

	jwtExpiration, err := strconv.Atoi(jwtExpirationStr)
	if err != nil {
		fmt.Println("JWT_EXPIRATION must be numeric")
		os.Exit(1)
	}

	dbHost := os.Getenv("DB_HOST")
	if dbHost == "" {
		fmt.Println("DB_HOST is required")
		os.Exit(1)
	}

	dbPortStr := os.Getenv("DB_PORT")
	if dbPortStr == "" {
		fmt.Println("DB_PORT is required")
		os.Exit(1)
	}

	dbPort, err := strconv.Atoi(dbPortStr)
	if err != nil {
		fmt.Println("DB_PORT must be numeric")
		os.Exit(1)
	}

	dbUser := os.Getenv("DB_USER")
	if dbUser == "" {
		fmt.Println("DB_USER is required")
		os.Exit(1)
	}

	dbPassword := os.Getenv("DB_PASSWORD")
	if dbPassword == "" {
		fmt.Println("DB_PASSWORD is required")
		os.Exit(1)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		fmt.Println("DB_NAME is required")
		os.Exit(1)
	}

	dbSSLStr := os.Getenv("DB_ENABLE_SSL_MODE")
	if dbSSLStr == "" {
		fmt.Println("DB_ENABLE_SSL_MODE is required")
		os.Exit(1)
	}

	dbSSL, err := strconv.ParseBool(dbSSLStr)
	if err != nil {
		fmt.Println("DB_ENABLE_SSL_MODE must be true or false")
		os.Exit(1)
	}

	configuration = &Config{
		Version:       version,
		ServiceName:   serviceName,
		HttpPort:      httpPort,
		JwtSecretKey:  jwtSecret,
		JwtExpiration: jwtExpiration,
		DB: &DBConfig{
			Host:          dbHost,
			Port:          dbPort,
			User:          dbUser,
			Password:      dbPassword,
			Name:          dbName,
			EnableSSLMode: dbSSL,
		},
	}
}

func GetConfig() *Config {
	if configuration == nil {
		loadConfig()
	}
	return configuration
}