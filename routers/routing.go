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

	self.server.POST("/auth/pwd", loginHandler.PwdLogin***REMOVED***
	self.server.POST("/auth/mobile", loginHandler.MobileLogin***REMOVED***
	self.server.PUT("/auth/reset", loginHandler.ResetPassword***REMOVED***
	self.server.POST("/register", registerHandler.Register***REMOVED***

	v1 := self.server.Group("/v1"***REMOVED***
	v1.Use(middleware.JWT([]byte(conf.JwtSecret***REMOVED******REMOVED******REMOVED*** //sha1 value of "tinker-api"
	v1.GET("/user", userHandler.Get***REMOVED***
}
