package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"gorm.io/gorm"
)

func setupRouter() *gin.Engine {
	// Disable Console Color
	// gin.DisableConsoleColor()
	r := gin.Default()

	r.StaticFile("/", "./app/index.html")
	r.Static("/js", "./app/js")
	r.Static("/css", "./app/css")
	r.Static("/lib", "./app/lib")
	r.Static("/partials", "./app/partials")

	db, err := gorm.Open(sqlite.Open("iread_kindle.db"), &gorm.Config{})

	if err != nil {
		panic("failed to connect database")
	}

	db.AutoMigrate(&Dict{}, &Book{}, &Chapter{})

	r.GET("/dict/:id", func(ctx *gin.Context) {
		var dict Dict
		key := ctx.Param("id")
		db.First(&dict, "key = ?", key)

		ctx.JSON(http.StatusOK, &dict)
	})

	r.POST("/dict", func(ctx *gin.Context) {
		var dict Dict
		if err := ctx.BindJSON(&dict); err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
		} else {
			db.Create(&dict)
			ctx.JSON(http.StatusCreated, &dict)
		}
	})

	r.PATCH("/dict", func(ctx *gin.Context) {
		var dict Dict
		if err := ctx.BindJSON(&dict); err != nil {
			ctx.JSON(http.StatusInternalServerError, nil)
		} else {
			var new_dict Dict
			db.First(&new_dict, "key = ?", dict.Key)
			new_dict.Value = dict.Value
			new_dict.Key = dict.Key
			db.Save(&new_dict)
			ctx.JSON(http.StatusCreated, &new_dict)
		}
	})

	r.GET("/book/:id", func(ctx *gin.Context) {
		var book Book
		id := ctx.Param("id")
		db.First(&book, "id = ?", id)

		ctx.JSON(http.StatusOK, &book)
	})

	r.POST("/book", func(ctx *gin.Context) {
		var book Book
		if err := ctx.BindJSON(&book); err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
		} else {
			db.Create(&book)
			ctx.JSON(http.StatusCreated, &book)
		}
	})

	r.PATCH("/book", func(ctx *gin.Context) {
		var book Book
		if err := ctx.BindJSON(&book); err != nil {
			ctx.JSON(http.StatusInternalServerError, nil)
		} else {
			db.Save(&book)
			ctx.JSON(http.StatusCreated, &book)
		}
	})

	r.GET("/chapter/:id", func(ctx *gin.Context) {
		var book Book
		id := ctx.Param("id")
		db.First(&book, "id = ?", id)

		ctx.JSON(http.StatusOK, &book)
	})

	r.POST("/chapter", func(ctx *gin.Context) {
		var book Book
		if err := ctx.BindJSON(&book); err != nil {
			ctx.JSON(http.StatusInternalServerError, err)
		} else {
			db.Create(&book)
			ctx.JSON(http.StatusCreated, &book)
		}
	})

	r.PATCH("/chapter", func(ctx *gin.Context) {
		var book Book
		if err := ctx.BindJSON(&book); err != nil {
			ctx.JSON(http.StatusInternalServerError, nil)
		} else {
			db.Save(&book)
			ctx.JSON(http.StatusCreated, &book)
		}
	})

	return r
}

func main() {
	r := setupRouter()
	// Listen and Server in 0.0.0.0:8080
	r.Run("0.0.0.0:8080")
}
