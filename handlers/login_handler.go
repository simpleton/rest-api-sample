package handlers

import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/dgrijalva/jwt-go"
	"time"
	"github.com/simpleton/rest-api-sample/conf"
	"github.com/simpleton/rest-api-sample/models"
	"github.com/simpleton/rest-api-sample/db"
)

type LoginHandler struct {
}

func(this *LoginHandler) EmailLogin(c echo.Context) error {
	emailLogin := new(models.EmailLogin)
	response := models.NewJsend()
	if err := c.Bind(emailLogin); err != nil {
		return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
	}
	userInfo, err := db.LoginWithEmail(*emailLogin.Email, emailLogin.Password)
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
	}
	if userInfo != nil {
		// Create token
		jwtToken := jwt.New(jwt.SigningMethodHS256)

		// Set claims
		claims := jwtToken.Claims.(jwt.MapClaims)
		claims["name"] = userInfo.Email
		claims["exp"] = time.Now().Add(time.Hour * 24 * 7).Unix()

		// Generate encoded token and send it as response.
		t, err := jwtToken.SignedString([]byte(conf.JwtSecret))
		if err != nil {
			return err
		}
		token := map[string]string{"token": t}
		return c.JSON(http.StatusOK, response.StatusCode(http.StatusOK).Data(token))
	}
	return echo.ErrUnauthorized
}

func(this *LoginHandler) MobileLogin(c echo.Context) error {
	//user := new(models.User)
	//if err := c.Bind(user); err != nil {
	//	return err
	//}
	return c.JSON(http.StatusCreated, "")
}

func(this *LoginHandler) ResetPassword(c echo.Context) error {
	//user := new(models.User)
	//if err := c.Bind(user); err != nil {
	//	return err
	//}
	return c.JSON(http.StatusCreated, "")
}
