package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/simpleton/rest-api-sample/routers"
	glog "github.com/labstack/gommon/log"
	"github.com/simpleton/rest-api-sample/db"
***REMOVED***

func main(***REMOVED*** {
	server := echo.New(***REMOVED***
	server.Logger.SetLevel(glog.DEBUG***REMOVED***

	server.Use(middleware.Logger(***REMOVED******REMOVED***
	server.Use(middleware.Recover(***REMOVED******REMOVED***
	server.Use(middleware.BodyLimit("4M"***REMOVED******REMOVED***
	server.Use(middleware.CORSWithCon***REMOVED***g(middleware.CORSCon***REMOVED***g{
		AllowOrigins: []string{"https://api.tinkerpatch.com", "http://*.swagger.io", "http://api.tinkerpatch.com"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType},
	}***REMOVED******REMOVED***
	
	//Run the API
	server.Logger.Debug("Init Router"***REMOVED***
	api := routers.NewAPIRouter(server***REMOVED***
	api.Init(***REMOVED***

	server.Logger.Debug("Init Database"***REMOVED***
	if err := db.InitDB(***REMOVED***; err != nil {
		panic(err***REMOVED***
	}
	defer db.RawDB.Close(***REMOVED***

	server.Logger.Debug("Start Running"***REMOVED***
	server.Logger.Fatal(server.Start(":8300"***REMOVED******REMOVED***
}
