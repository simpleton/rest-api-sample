package handlers

import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/dgrijalva/jwt-go"
	"time"
	"github.com/simpleton/tinker-api/conf"
	"github.com/simpleton/tinker-api/models"
	"github.com/simpleton/tinker-api/db"
***REMOVED***

type LoginHandler struct {
}

func(this *LoginHandler***REMOVED*** EmailLogin(c echo.Context***REMOVED*** error {
	emailLogin := new(models.EmailLogin***REMOVED***
	response := models.NewJsend(***REMOVED***
	if err := c.Bind(emailLogin***REMOVED***; err != nil {
		return c.JSON(http.StatusUnauthorized, response.StatusCode(http.StatusUnauthorized***REMOVED***.Message(err.Error(***REMOVED******REMOVED******REMOVED***
	}
	userInfo, err := db.LoginWithEmail(*emailLogin.Email, emailLogin.Password***REMOVED***
	if err != nil {
		return c.JSON(http.StatusUnauthorized, response.StatusCode(http.StatusUnauthorized***REMOVED***.Message(err.Error(***REMOVED******REMOVED******REMOVED***
	}
	if userInfo != nil {
		// Create token
		token := jwt.New(jwt.SigningMethodHS256***REMOVED***

		// Set claims
		claims := token.Claims.(jwt.MapClaims***REMOVED***
		claims["name"] = userInfo.Email
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
	//user := new(models.User***REMOVED***
	//if err := c.Bind(user***REMOVED***; err != nil {
	//	return err
	//}
	return c.JSON(http.StatusCreated, ""***REMOVED***
}

func(this *LoginHandler***REMOVED*** ResetPassword(c echo.Context***REMOVED*** error {
	//user := new(models.User***REMOVED***
	//if err := c.Bind(user***REMOVED***; err != nil {
	//	return err
	//}
	return c.JSON(http.StatusCreated, ""***REMOVED***
}
