package router

import (
	"fmt"
	"log"
	"net/http"
	"strings"
	"sync"

	"food-order-management/config"
	"food-order-management/pkg/middleware"
)

type Route struct {
	Method      string
	Pattern     string
	Handler     http.HandlerFunc
	Middlewares []func(http.Handler) http.Handler
}

// routeKey creates a unique key for method + pattern combination
func routeKey(method, pattern string) string {
	return method + ":" + pattern
}

func SetupRoutes(routes []Route, cfg *config.Config) http.Handler {
	// Use a custom mux to avoid duplicate registration
	mux := http.NewServeMux()
	
	// Track registered routes to prevent duplicates
	registeredRoutes := make(map[string]bool)
	var mu sync.Mutex

	// Register a catch-all handler
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := r.URL.Path
		method := r.Method
		
		// Find matching route
		for _, route := range routes {
			if route.Method != method {
				continue
			}

			// Check if the path matches
			if matchPath(path, route.Pattern) {
				// Apply middlewares
				handler := route.Handler
				for i := len(route.Middlewares) - 1; i >= 0; i-- {
					handler = route.Middlewares[i](http.HandlerFunc(handler)).ServeHTTP
				}
				handler(w, r)
				return
			}
		}
		
		// No route found
		http.NotFound(w, r)
	})

	// Log and validate routes
	mu.Lock()
	for _, route := range routes {
		key := routeKey(route.Method, route.Pattern)
		if registeredRoutes[key] {
			log.Printf("Warning: Duplicate route found: %s %s", route.Method, route.Pattern)
			continue
		}
		registeredRoutes[key] = true
		log.Printf("Registered route: %s %s", route.Method, route.Pattern)
	}
	mu.Unlock()

	log.Printf("Total routes registered: %d", len(registeredRoutes))

	// Apply global middlewares
	var handler http.Handler = mux
	handler = middleware.RecoveryMiddleware(handler)
	handler = middleware.LoggerMiddleware(handler)
	handler = middleware.CORSMiddleware(handler)

	return handler
}

// matchPath checks if the request path matches the route pattern
func matchPath(requestPath, routePattern string) bool {
	// Exact match
	if requestPath == routePattern {
		return true
	}

	// Prefix match (pattern ends with /)
	if strings.HasSuffix(routePattern, "/") {
		return strings.HasPrefix(requestPath, routePattern)
	}

	// Check for parameterized routes
	// Split both paths into segments
	reqParts := strings.Split(strings.Trim(requestPath, "/"), "/")
	patternParts := strings.Split(strings.Trim(routePattern, "/"), "/")

	// If lengths don't match, it's not a match
	if len(reqParts) != len(patternParts) {
		return false
	}

	// Compare each segment
	for i, patternPart := range patternParts {
		// If pattern part is a parameter (starts with : or is *)
		if strings.HasPrefix(patternPart, ":") || patternPart == "*" {
			continue
		}
		// Exact match for this segment
		if patternPart != reqParts[i] {
			return false
		}
	}

	return true
}

// Helper to extract path parameter
func GetPathParam(path, pattern string, paramName string) string {
	reqParts := strings.Split(strings.Trim(path, "/"), "/")
	patternParts := strings.Split(strings.Trim(pattern, "/"), "/")

	for i, part := range patternParts {
		if part == ":"+paramName && i < len(reqParts) {
			return reqParts[i]
		}
	}
	return ""
}

// Helper to log route conflicts
func ValidateRoutes(routes []Route) {
	routeMap := make(map[string][]string)
	
	for _, route := range routes {
		key := routeKey(route.Method, route.Pattern)
		routeMap[key] = append(routeMap[key], fmt.Sprintf("%p", route.Handler))
	}
	
	for key, handlers := range routeMap {
		if len(handlers) > 1 {
			log.Printf("WARNING: Duplicate route: %s (registered %d times)", key, len(handlers))
		}
	}
}