package utils

import (
	"strconv"
	"strings"
)

func StringToInt(s string) (int, error) {
	return strconv.Atoi(strings.TrimSpace(s))
}

func IntToString(i int) string {
	return strconv.Itoa(i)
}