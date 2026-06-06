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


/*
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

// Biến global pool (quan trọng nhất)
var pool *pgxpool.Pool

func init() {
	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		panic("DATABASE_URL environment variable is not set")
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		panic(fmt.Sprintf("Failed to parse DATABASE_URL: %v", err))
	}

	// === Tối ưu cho Vercel Serverless + Neon ===
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = 30 * time.Minute
	config.MaxConnIdleTime = 5 * time.Minute
	config.HealthCheckPeriod = 1 * time.Minute

	// Tăng timeout khi Neon đang wake up
	config.ConnConfig.ConnectTimeout = 15 * time.Second

	ctx := context.Background()
	pool, err = pgxpool.NewWithConfig(ctx, config)
	if err != nil {
		panic(fmt.Sprintf("Failed to create connection pool: %v", err))
	}

	// Kiểm tra kết nối ban đầu
	if err := pool.Ping(ctx); err != nil {
		fmt.Printf("Warning: Initial ping failed: %v\n", err)
	}
}

func Handler(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context() // Dùng context từ request để hỗ trợ timeout/cancel

	// Test connection (nếu cần)
	if err := pool.Ping(ctx); err != nil {
		http.Error(w, fmt.Sprintf("Database connection error: %v", err), http.StatusInternalServerError)
		return
	}

	rows, err := pool.Query(ctx, "SELECT id, name, slug FROM categories LIMIT 10")
	if err != nil {
		http.Error(w, fmt.Sprintf("Query error: %v", err), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	items := make([]Category, 0, 10)

	for rows.Next() {
		var c Category
		err := rows.Scan(&c.ID, &c.Name, &c.Slug)
		if err != nil {
			http.Error(w, fmt.Sprintf("Scan error: %v", err), http.StatusInternalServerError)
			return
		}
		items = append(items, c)
	}

	if err = rows.Err(); err != nil {
		http.Error(w, fmt.Sprintf("Rows error: %v", err), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(items); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}
*/

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
/*
	if connStr == "" {
		fmt.Println("WARNING: DATABASE_URL is not set! Function will fail on requests.")
		return // Không panic nữa
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		fmt.Printf("Failed to parse DATABASE_URL: %v\n", err)
		return
	}
*/
if connStr == "" {
		panic("DATABASE_URL environment variable is not set")
	}

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		panic(fmt.Sprintf("Failed to parse DATABASE_URL: %v", err))
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





