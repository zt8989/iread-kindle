package main

// gorm.Model definition
type Dict struct {
	ID    uint   `gorm:"primaryKey" json:"id"`
	Key   string `gorm:"uniqueIndex" json:"key"`
	Value string `json:"value"`
}
