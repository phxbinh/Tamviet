package handler

import (
	"encoding/json"
	"net/http"
	"time"
)

func isPrimeGo(n int) bool {
	if n <= 1 {
		return false
	}
	for i := 2; i*i <= n; i++ {
		if n%i == 0 {
			return false
		}
	}
	return true
}

func Handler(w http.ResponseWriter, r *http.Request) {
	start := time.Now()

	limit := 10000000
	var sum int64 = 0
	for i := 2; i < limit; i++ {
		if isPrimeGo(i) {
			sum += int64(i)
		}
	}

	duration := time.Since(start).Seconds() * 1000

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"language":          "Go (Vercel Serverless)",
		"limit":             limit,
		"sum_result":        sum,
		"execution_time_ms": duration,
	})
}
