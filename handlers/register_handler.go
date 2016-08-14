package handlers

import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/simpleton/tinker-api/models"
***REMOVED***

type RegisterHandler struct {

}

func(this *RegisterHandler***REMOVED*** Register(c echo.Context***REMOVED*** error {
	register := new(models.RegisterInfo***REMOVED***
	if err := c.Bind(register***REMOVED***; err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, register***REMOVED***
}
