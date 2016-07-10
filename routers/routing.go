package routers

import (
    "github.com/labstack/echo"
    "net/http"
    "time"
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
    self.server.GET("/", func(c echo.Context***REMOVED*** error {
        return c.String(http.StatusOK, "Hello, World! Grace!"***REMOVED***
    }***REMOVED***
}
