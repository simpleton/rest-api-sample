package routers

import (
	"github.com/labstack/echo"
	"github.com/simpleton/tinker-api/handlers"
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
	self.server.GET("/", loginHandler.Get***REMOVED***
}
