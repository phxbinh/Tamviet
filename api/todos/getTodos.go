package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
)

// 1. Cập nhật lại Struct để khớp với các trường id (UUID -> string), name, slug
type Category struct {
	ID   string `json:"id"` // UUID trong Postgres tương đương với string trong Go
	Name string `json:"name"`
	Slug string `json:"slug"`
}

func Handler(w http.ResponseWriter, r *http.Request) {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		http.Error(w, "Chưa cấu hình biến môi trường DATABASE_URL", http.StatusInternalServerError)
		return
	}

	ctx := context.Background()

	conn, err := pgx.Connect(ctx, connStr)
	if err != nil {
		http.Error(w, fmt.Sprintf("Không thể kết nối tới Neon: %v", err), http.StatusInternalServerError)
		return
	}
	defer conn.Close(ctx)

	// 2. Cập nhật câu lệnh SQL: SELECT id, name, slug từ bảng của bạn (Ví dụ đặt tên bảng là categories)
	rows, err := conn.Query(ctx, "SELECT id, name, slug FROM categories LIMIT 10")
	if err != nil {
		http.Error(w, fmt.Sprintf("Lỗi truy vấn dữ liệu: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	// 3. Thay đổi kiểu mảng dữ liệu thành Category
	items := make([]Category, 0, 10) 
	
	for rows.Next() {
		var c Category
		// rows.Scan sẽ tự động convert UUID từ Postgres sang kiểu string của Go
		err := rows.Scan(&c.ID, &c.Name, &c.Slug)
		if err != nil {
			http.Error(w, fmt.Sprintf("Lỗi parse dữ liệu: %v", err), http.StatusInternalServerError)
			return
		}
		items = append(items, c)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}
