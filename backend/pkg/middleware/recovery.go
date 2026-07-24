package middleware

import (
	"log"
	"net/http"
	"runtime/debug"

	"food-order-management/pkg/response"
)

func RecoveryMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		defer func() {
			if err := recover(); err != nil {
				log.Printf("PANIC: %v\n%s", err, debug.Stack())
				response.InternalServerError(w, "Internal server error")
			}
		}()

		next.ServeHTTP(w, r)
	})
}