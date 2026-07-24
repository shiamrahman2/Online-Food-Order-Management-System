package utils

import (
	"regexp"
	"strings"
)

func ValidateEmail(email string) bool {
	pattern := `^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`
	regex := regexp.MustCompile(pattern)
	return regex.MatchString(email)
}

func ValidatePhone(phone string) bool {
	pattern := `^\+?[0-9]{10,15}$`
	regex := regexp.MustCompile(pattern)
	return regex.MatchString(phone)
}

func ValidatePassword(password string) (bool, string) {
	if len(password) < 8 {
		return false, "Password must be at least 8 characters"
	}
	if !strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ") {
		return false, "Password must contain at least one uppercase letter"
	}
	if !strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz") {
		return false, "Password must contain at least one lowercase letter"
	}
	if !strings.ContainsAny(password, "0123456789") {
		return false, "Password must contain at least one number"
	}
	return true, ""
}

func ValidatePrice(price float64) bool {
	return price > 0
}

func ValidateRequired(value string) bool {
	return strings.TrimSpace(value) != ""
}