package database

import (
	"context"
	"fmt"
	"log"
	"net/url"
	"time"

	"food-order-management/config"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func GetConnectionString(cnf *config.DBConfig) string {
	sslMode := "disable"
	if cnf.EnableSSLMode {
		sslMode = "require"
	}

	u := &url.URL{
		Scheme: "postgres",
		User:   url.UserPassword(cnf.User, cnf.Password),
		Host:   fmt.Sprintf("%s:%d", cnf.Host, cnf.Port),
		Path:   cnf.Name,
	}

	q := u.Query()
	q.Set("sslmode", sslMode)
	u.RawQuery = q.Encode()

	return u.String()
}

func Connect(cnf *config.DBConfig) error {

	connectionString := GetConnectionString(cnf)

	poolConfig, err := pgxpool.ParseConfig(connectionString)
	if err != nil {
		return fmt.Errorf("failed to parse database config: %w", err)
	}

	poolConfig.MaxConns = 20
	poolConfig.MinConns = 5
	poolConfig.MaxConnLifetime = time.Hour
	poolConfig.MaxConnIdleTime = 30 * time.Minute

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return fmt.Errorf("failed to create pool: %w", err)
	}

	if err := pool.Ping(ctx); err != nil {
		return fmt.Errorf("failed to connect database: %w", err)
	}

	DB = pool

	log.Println("Database Connected Successfully")

	return nil
}

func Close() {
	if DB != nil {
		DB.Close()
	}
}