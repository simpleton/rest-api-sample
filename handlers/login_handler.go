package handlers

import (
	"github.com/labstack/echo"
	"net/http"
***REMOVED***

type LoginHandler struct {

}

func(this *LoginHandler***REMOVED*** Get(c echo.Context***REMOVED*** error {
	return c.String(http.StatusOK, "Hello, World! Grace!"***REMOVED***
}
