package main

import "time"

// gorm.Model definition
type Chapter struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"createAt"`
	UpdatedAt time.Time `json:"updatedAt"`
	BookId    uint      `json:"bookId"`
	Book      Book      `json:"book"`
}
