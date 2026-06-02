package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
)

// Định nghĩa struct cho dữ liệu trả về
type ResponseData struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}

// Vercel yêu cầu hàm xử lý chính phải được đặt tên là Handler (viết hoa)
func Handler(w http.ResponseWriter, r *http.Request) {
	// Chỉ cho phép phương thức GET (tùy chọn)
	if r.Method != http.MethodGet {
		w.WriteHeader(http.StatusMethodNotAllowed)
		fmt.Fprintf(w, "Method not allowed")
		return
	}

	// Lấy query parameter từ URL (ví dụ: /api/hello?name=Go)
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "Developer"
	}

	// Tạo dữ liệu phản hồi
	response := ResponseData{
		Message: fmt.Sprintf("Xin chào %s! Hàm Go này chạy trực tiếp trên Vercel Serverless!", name),
		Status:  http.StatusOK,
	}

	// Thiết lập Header định dạng JSON
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Encode struct thành JSON và trả về cho Client
	json.NewEncoder(w).Encode(response)
}
