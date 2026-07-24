# Food Order Management System

A production-ready online food order management system built with Go.

## Tech Stack

- Go 1.21+
- PostgreSQL
- pgx/v5
- JWT Authentication
- bcrypt password hashing
- Clean Architecture

## Features

- Multi-role authentication (Admin, Customer, Restaurant, Delivery Person)
- Restaurant management
- Menu management
- Order management with status tracking
- Payment processing
- Dashboard statistics
- JWT-based authentication
- Role-based access control

## Getting Started

### Prerequisites

- Go 1.21 or higher
- PostgreSQL 12 or higher

### Installation

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Create PostgreSQL database
4. Run migrations from the `migrations/` folder
5. Run the application:

```bash
go run cmd/server/main.go