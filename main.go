package main

import (
	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
	"github.com/simpleton/rest-api-sample/routers"
	glog "github.com/labstack/gommon/log"
	_ "github.com/simpleton/rest-api-sample/db"
)

func main() {
	server := echo.New()
	server.Logger.SetLevel(glog.DEBUG)

	server.Use(middleware.Logger())
	server.Use(middleware.Recover())
	server.Use(middleware.BodyLimit("4M"))
	server.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"https://api.tinkerpatch.com", "http://*.swagger.io", "http://api.tinkerpatch.com"},
		AllowHeaders: []string{echo.HeaderOrigin, echo.HeaderContentType},
	}))
	
	//Run the API
	server.Logger.Debug("Init Router")
	api := routers.NewAPIRouter(server)
	api.Init()

	server.Logger.Debug("Init Database")
	//if err := db.InitDB(); err != nil {
	//	panic(err)
	//}
	//defer db.RawDB.Close()

	server.Logger.Debug("Start Running")
	server.Logger.Fatal(server.Start(":8300"))
}
