package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"strings"
	"todo-app/models"
)

type Handler struct {
	DB *sql.DB
}

func (h *Handler) List(w http.ResponseWriter, r *http.Request) {
	rows, err := h.DB.Query(
		"SELECT id, title, status, priority, created_at FROM todos ORDER BY created_at DESC",
	)
	if err != nil {
		jsonError(w, "query failed", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	todos := []models.Todo{}
	for rows.Next() {
		var t models.Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Status, &t.Priority, &t.CreatedAt); err != nil {
			jsonError(w, "scan failed", http.StatusInternalServerError)
			return
		}
		todos = append(todos, t)
	}
	jsonOK(w, todos)
}

func (h *Handler) Create(w http.ResponseWriter, r *http.Request) {
	var body struct {
		Title    string `json:"title"`
		Priority int    `json:"priority"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil || strings.TrimSpace(body.Title) == "" {
		jsonError(w, "title required", http.StatusBadRequest)
		return
	}

	res, err := h.DB.Exec(
		"INSERT INTO todos (title, priority) VALUES (?, ?)",
		strings.TrimSpace(body.Title), body.Priority,
	)
	if err != nil {
		jsonError(w, "insert failed", http.StatusInternalServerError)
		return
	}

	id, _ := res.LastInsertId()
	var t models.Todo
	h.DB.QueryRow(
		"SELECT id, title, status, priority, created_at FROM todos WHERE id = ?", id,
	).Scan(&t.ID, &t.Title, &t.Status, &t.Priority, &t.CreatedAt)

	w.WriteHeader(http.StatusCreated)
	jsonOK(w, t)
}

func (h *Handler) Update(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r.URL.Path)
	if err != nil {
		jsonError(w, "invalid id", http.StatusBadRequest)
		return
	}

	var body struct {
		Title    *string `json:"title"`
		Status   *string `json:"status"`
		Priority *int    `json:"priority"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		jsonError(w, "invalid body", http.StatusBadRequest)
		return
	}

	var t models.Todo
	err = h.DB.QueryRow(
		"SELECT id, title, status, priority, created_at FROM todos WHERE id = ?", id,
	).Scan(&t.ID, &t.Title, &t.Status, &t.Priority, &t.CreatedAt)
	if err == sql.ErrNoRows {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}

	if body.Title != nil {
		t.Title = strings.TrimSpace(*body.Title)
	}
	if body.Status != nil {
		t.Status = *body.Status
	}
	if body.Priority != nil {
		t.Priority = *body.Priority
	}

	_, err = h.DB.Exec(
		"UPDATE todos SET title = ?, status = ?, priority = ? WHERE id = ?",
		t.Title, t.Status, t.Priority, id,
	)
	if err != nil {
		jsonError(w, "update failed", http.StatusInternalServerError)
		return
	}
	jsonOK(w, t)
}

func (h *Handler) Delete(w http.ResponseWriter, r *http.Request) {
	id, err := idFromPath(r.URL.Path)
	if err != nil {
		jsonError(w, "invalid id", http.StatusBadRequest)
		return
	}

	res, err := h.DB.Exec("DELETE FROM todos WHERE id = ?", id)
	if err != nil {
		jsonError(w, "delete failed", http.StatusInternalServerError)
		return
	}
	n, _ := res.RowsAffected()
	if n == 0 {
		jsonError(w, "not found", http.StatusNotFound)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func idFromPath(path string) (int64, error) {
	parts := strings.Split(strings.TrimSuffix(path, "/"), "/")
	return strconv.ParseInt(parts[len(parts)-1], 10, 64)
}

func jsonOK(w http.ResponseWriter, v any) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(v)
}

func jsonError(w http.ResponseWriter, msg string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": msg})
}
