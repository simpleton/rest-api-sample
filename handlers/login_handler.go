package handlers

import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/simpleton/tinker-api/models"
	"github.com/dgrijalva/jwt-go"
	"time"
	"github.com/simpleton/tinker-api/conf"
***REMOVED***

type LoginHandler struct {
}

func(this *LoginHandler***REMOVED*** PwdLogin(c echo.Context***REMOVED*** error {
	user := new(models.UserLogin***REMOVED***
	if err := c.Bind(user***REMOVED***; err != nil {
		return err
	}
	if user.UserName == "sim" && user.Password == "sun" {
		// Create token
		token := jwt.New(jwt.SigningMethodHS256***REMOVED***

		// Set claims
		claims := token.Claims.(jwt.MapClaims***REMOVED***
		claims["name"] = "sim"
		claims["exp"] = time.Now(***REMOVED***.Add(time.Hour * 24 * 7***REMOVED***.Unix(***REMOVED***

		// Generate encoded token and send it as response.
		t, err := token.SignedString([]byte(conf.JwtSecret***REMOVED******REMOVED***
		if err != nil {
			return err
		}
		return c.JSON(http.StatusOK, map[string]string{"token": t}***REMOVED***
	}
	return echo.ErrUnauthorized
}

func(this *LoginHandler***REMOVED*** MobileLogin(c echo.Context***REMOVED*** error {
	user := new(models.User***REMOVED***
	if err := c.Bind(user***REMOVED***; err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, user***REMOVED***
}

func(this *LoginHandler***REMOVED*** ResetPassword(c echo.Context***REMOVED*** error {
	user := new(models.User***REMOVED***
	if err := c.Bind(user***REMOVED***; err != nil {
		return err
	}
	return c.JSON(http.StatusCreated, user***REMOVED***
}
