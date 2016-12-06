package handlers

import (
	"github.com/labstack/echo"
	"net/http"
	"github.com/simpleton/rest-api-sample/models"
	"github.com/simpleton/rest-api-sample/db"
	"github.com/twinj/uuid"
)

type RegisterHandler struct {

}

func(this *RegisterHandler) Register(c echo.Context) error {
	register := new(models.RegisterInfo)
	response := models.NewJsend()
	if err := c.Bind(register); err != nil {
		return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
	}
	// check user existed
	if existed, err := db.CheckEmailExisted(register.Email); err != nil {
		return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
	} else {
		if existed {
			return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
		}
	}
	salt := uuid.NewV4()
	err := db.CreateUser(register.Username, register.Password, register.Email, salt.String())
	if err != nil {
		return c.JSON(http.StatusBadRequest, response.StatusCode(http.StatusBadRequest).Message(err.Error()))
	}
	return c.JSON(http.StatusCreated, register)
}
