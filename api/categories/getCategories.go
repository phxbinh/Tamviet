/*
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
*/



/* //Chạy được -> Grok -> chưa tối ưu
package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

var pool *pgxpool.Pool

func init() {
	connStr := os.Getenv("DATABASE_URL")

	if connStr == "" {
		fmt.Println("WARNING: DATABASE_URL is not set! Function will fail on requests.")
		return // Không panic nữa
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		fmt.Printf("Failed to parse DATABASE_URL: %v\n", err)
		return
	}

	// Tối ưu cho Vercel Serverless + Neon
	config.MaxConns = 8
	config.MinConns = 1
	config.MaxConnLifetime = 25 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute
	config.HealthCheckPeriod = 1 * time.Minute
	config.ConnConfig.ConnectTimeout = 15 * time.Second

	ctx := context.Background()
	pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		fmt.Printf("Failed to create pool: %v\n", err)
		return
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	if pool == nil {
		http.Error(w, "Database pool chưa được khởi tạo. Kiểm tra DATABASE_URL.", http.StatusInternalServerError)
		return
	}

	ctx := r.Context()

	// Query
	rows, err := pool.Query(ctx, "SELECT id, name, slug FROM categories LIMIT 10")
	if err != nil {
		http.Error(w, fmt.Sprintf("Lỗi truy vấn: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	items := make([]Category, 0, 10)

	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			http.Error(w, fmt.Sprintf("Lỗi parse dữ liệu: %v", err), http.StatusInternalServerError)
			return
		}
		items = append(items, c)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, fmt.Sprintf("Lỗi rows: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}
*/


/* // Chạy được -> Gemini -> tối ưu kết nối với neon
package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

// Cấu trúc chuẩn cho phản hồi lỗi dạng JSON
type ErrorResponse struct {
	Error string `json:"error"`
}

var pool *pgxpool.Pool

func init() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		fmt.Println("WARNING: DATABASE_URL is not set! Function will fail on requests.")
		return
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		fmt.Printf("Failed to parse DATABASE_URL: %v\n", err)
		return
	}

	// TỐI ƯU CHO VERCEL SERVERLESS + NEON POOLING
	// Vì mỗi instance của Vercel xử lý tuần tự (hoặc rất ít request đồng thời),
	// hạ MaxConns xuống giúp tránh lỗi "Too many connections" khi Vercel scale nhiều instance.
	config.MaxConns = 2 
	config.MinConns = 0 // Cho phép pool về 0 khi idle để giải phóng tài nguyên cho Neon
	config.MaxConnLifetime = 15 * time.Minute
	config.MaxConnIdleTime = 2 * time.Minute
	config.HealthCheckPeriod = 1 * time.Minute
	config.ConnConfig.ConnectTimeout = 10 * time.Second

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		fmt.Printf("Failed to create pool: %v\n", err)
		return
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Luôn trả về Content-Type là JSON cho mọi phản hồi
	w.Header().Set("Content-Type", "application/json")

	if pool == nil {
		fmt.Println("ERROR: Database pool is nil. Check DATABASE_URL.")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Dịch vụ tạm thời không khả dụng"})
		return
	}

	// Đặt timeout cho cả quá trình xử lý request (Tránh treo function gây tốn tiền Vercel)
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	// Query dữ liệu
	rows, err := pool.Query(ctx, "SELECT id, name, slug FROM categories LIMIT 10")
	if err != nil {
		// Log lỗi chi tiết nội bộ để bạn debug trên log của Vercel
		fmt.Printf("Database query error: %v\n", err)
		
		// Trả về lỗi chung chung cho client để bảo mật thông tin hệ thống
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Không thể lấy danh sách danh mục"})
		return
	}
	defer rows.Close()

	items := make([]Category, 0, 10)

	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			fmt.Printf("Row scan error: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Lỗi xử lý dữ liệu hệ thống"})
			return
		}
		items = append(items, c)
	}

	if err = rows.Err(); err != nil {
		fmt.Printf("Rows iteration error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Lỗi đồng bộ dữ liệu"})
		return
	}

	// Trả về kết quả thành công
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}
*/

// Grok -> Fix (from Gemini code) -> Thêm CORS
package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Category struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

var pool *pgxpool.Pool

// ==================== CORS CONFIG ====================
var allowedOrigins = map[string]bool{
	"http://localhost:3000":                  true, // Development
	"https://localhost:3000":                 true,
	"https://tamviet.vercel.app":             true, // Production
	"https://www.tamviet.vercel.app":         true,
	// Thêm domain production thật của bạn vào đây
}

// setCORS set các header CORS
func setCORS(w http.ResponseWriter, r *http.Request) {
	origin := r.Header.Get("Origin")

	// Cho phép origin nếu nằm trong danh sách hoặc dùng wildcard (*) cho dev
	if allowedOrigins[origin] {
		w.Header().Set("Access-Control-Allow-Origin", origin)
	} else {
		w.Header().Set("Access-Control-Allow-Origin", "*") // Hoặc comment nếu muốn chặt chẽ
	}

	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

// Handle OPTIONS request (Preflight)
func handleOptions(w http.ResponseWriter, r *http.Request) {
	setCORS(w, r)
	w.WriteHeader(http.StatusOK)
}

func init() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		fmt.Println("WARNING: DATABASE_URL is not set! Function will fail on requests.")
		return
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		fmt.Printf("Failed to parse DATABASE_URL: %v\n", err)
		return
	}

	// Tối ưu cho Vercel + Neon
	config.MaxConns = 2
	config.MinConns = 0
	config.MaxConnLifetime = 15 * time.Minute
	config.MaxConnIdleTime = 2 * time.Minute
	config.HealthCheckPeriod = 1 * time.Minute
	config.ConnConfig.ConnectTimeout = 10 * time.Second

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		fmt.Printf("Failed to create pool: %v\n", err)
		return
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	// Xử lý Preflight OPTIONS request
	if r.Method == http.MethodOptions {
		handleOptions(w, r)
		return
	}

	// Set CORS cho các request khác
	setCORS(w, r)

	// Luôn trả về JSON
	w.Header().Set("Content-Type", "application/json")

	if pool == nil {
		fmt.Println("ERROR: Database pool is nil. Check DATABASE_URL.")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Dịch vụ tạm thời không khả dụng"})
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	rows, err := pool.Query(ctx, "SELECT id, name, slug FROM categories LIMIT 10")
	if err != nil {
		fmt.Printf("Database query error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Không thể lấy danh sách danh mục"})
		return
	}
	defer rows.Close()

	items := make([]Category, 0, 10)

	for rows.Next() {
		var c Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Slug); err != nil {
			fmt.Printf("Row scan error: %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(ErrorResponse{Error: "Lỗi xử lý dữ liệu"})
			return
		}
		items = append(items, c)
	}

	if err = rows.Err(); err != nil {
		fmt.Printf("Rows iteration error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(ErrorResponse{Error: "Lỗi đồng bộ dữ liệu"})
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(items)
}









