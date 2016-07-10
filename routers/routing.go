package routers

import (
    "github.com/labstack/echo"
    "net/http"
***REMOVED***

type APIRouting struct {
    server *echo.Echo
}

func (self *APIRouting***REMOVED*** Init(***REMOVED*** {
    self.server.GET("/", func(c echo.Context***REMOVED*** error {
        return c.String(http.StatusOK, "Hello, World!"***REMOVED***
    }***REMOVED***
}
