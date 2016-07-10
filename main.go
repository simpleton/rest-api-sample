package main

import (
    "net/http"
    "github.com/simpleton/tinker-api/routers"
    "github.com/facebookgo/grace/gracehttp"
    "github.com/labstack/echo"
    "github.com/labstack/echo/engine/standard"
    "github.com/labstack/echo/middleware"
***REMOVED***

func main(***REMOVED*** {
    server := echo.New(***REMOVED***
    server.Use(middleware.Logger(***REMOVED******REMOVED***
    server.Use(middleware.Recover(***REMOVED******REMOVED***

    //Run the API
    var api routers.APIRouting
    api.Init(***REMOVED***

    server.GET("/", func(c echo.Context***REMOVED*** error {
        return c.String(http.StatusOK, "Hello, World!"***REMOVED***
    }***REMOVED***
    std := standard.New(":1323"***REMOVED***
    std.SetHandler(server***REMOVED***
    gracehttp.Serve(std.Server***REMOVED***
}
