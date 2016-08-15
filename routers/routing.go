package routers

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/simpleton/tinker-api/handlers"
	"github.com/simpleton/tinker-api/conf"
***REMOVED***

type APIRouter struct {
	server *echo.Echo
}

func NewAPIRouter(apiServer *echo.Echo***REMOVED*** *APIRouter {
	router := &APIRouter{
		server: apiServer,
	}
	return router
}

func (self *APIRouter***REMOVED*** Init(***REMOVED*** {
	loginHandler := handlers.LoginHandler{}
	registerHandler := handlers.RegisterHandler{}
	userHandler := handlers.UserHandler{}

	self.server.POST("/users/mobile_login", loginHandler.MobileLogin***REMOVED***
	self.server.POST("/users/email_login", loginHandler.EmailLogin***REMOVED***
	self.server.POST("/users/register", registerHandler.Register***REMOVED***

	self.server.File("/swagger.json", "swagger/swagger.json"***REMOVED***
	self.server.Use(middleware.StaticWithCon***REMOVED***g(middleware.StaticCon***REMOVED***g{
		Root:   "swagger/dist",
		Index:  "index.html",
		HTML5:  true,
		Browse: false,
	}***REMOVED******REMOVED***
	v1 := self.server.Group("/v1"***REMOVED***
	v1.Use(middleware.JWT([]byte(conf.JwtSecret***REMOVED******REMOVED******REMOVED*** //sha1 value of "tinker-api"
	v1.GET("/user", userHandler.Get***REMOVED***
}
