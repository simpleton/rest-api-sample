package handlers

import (
	"github.com/labstack/echo"
	"net/http"
***REMOVED***

type UserHandler struct {
}

func(this *UserHandler***REMOVED*** Get(c echo.Context***REMOVED*** error {
	return c.String(http.StatusOK, "Hello, World! User!"***REMOVED***
}
