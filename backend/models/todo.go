package models

type Todo struct {
	ID        int64  `json:"id"`
	Title     string `json:"title"`
	Status    string `json:"status"`
	Priority  int    `json:"priority"`
	CreatedAt string `json:"created_at"`
}
