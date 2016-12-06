package routers

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/simpleton/rest-api-sample/handlers"
	"github.com/simpleton/rest-api-sample/conf"
)

type APIRouter struct {
	server *echo.Echo
}

func NewAPIRouter(apiServer *echo.Echo) *APIRouter {
	router := &APIRouter{
		server: apiServer,
	}
	return router
}

func (self *APIRouter) Init() {
	loginHandler := handlers.LoginHandler{}
	registerHandler := handlers.RegisterHandler{}
	userHandler := handlers.UserHandler{}

	self.server.POST("/users/mobile_login", loginHandler.MobileLogin)
	self.server.POST("/users/email_login", loginHandler.EmailLogin)
	self.server.POST("/users/register", registerHandler.Register)

	self.server.File("/docs/swagger.json", "swagger/swagger.json")
	self.server.Static("/docs", "swagger/dist")
	v1 := self.server.Group("/v1")
	v1.Use(middleware.JWT([]byte(conf.JwtSecret))) //sha1 value of "rest-api-sample"
	v1.GET("/user", userHandler.Get)
}
