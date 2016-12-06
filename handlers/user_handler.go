package handlers

import (
	"github.com/labstack/echo"
	"net/http"
)

type UserHandler struct {
}

func(this *UserHandler) Get(c echo.Context) error {
	return c.String(http.StatusOK, "Hello, World! User!")
}
