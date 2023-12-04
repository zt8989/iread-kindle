package main

import "time"

// gorm.Model definition
type Book struct {
	ID                 uint      `gorm:"primaryKey" json:"id"`
	Author             string    `json:"author"`
	BookUrl            string    `json:"bookUrl"`
	CoverUrl           string    `json:"coverUrl"`
	DurChapterIndex    uint      `json:"durChapterIndex"`
	DurChapterTime     time.Time `json:"durChapterTime"`
	DurChapterTitle    string    `json:"durChapterTitle"`
	Intro              string    `json:"intro"`
	Kind               string    `json:"kind"`
	LastCheckTime      time.Time `json:"lastCheckTime"`
	LatestChapterTime  time.Time `json:"latestChapterTime"`
	LatestChapterTitle string    `json:"latestChapterTitle"`
	Name               string    `json:"name"`
	Origin             string    `json:"origin"`
	OriginName         string    `json:"originName"`
	TocUrl             string    `json:"tocUrl"`
	TotalChapterNum    uint      `json:"totalChapterNum"`
	CreatedAt          time.Time `json:"createdAt"`
	UpdatedAt          time.Time `json:"updatedAt"`
}
