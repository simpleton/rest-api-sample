package handlers

import (
	"github.com/labstack/echo"
	"net/http"
***REMOVED***

type RegisterHandler struct {

}

func(this *RegisterHandler***REMOVED*** Get(c echo.Context***REMOVED*** error {
	return c.String(http.StatusOK, "Hello, World! Register!"***REMOVED***
}
