package models

import (
	"database/sql"

	_ "github.com/lib/pq"
	"gopkg.in/mgutz/dat.v1"
	"gopkg.in/mgutz/dat.v1/sqlx-runner"
	"time"
	"github.com/simpleton/tinker-api/conf"
	"fmt"
	glog "github.com/labstack/gommon/log"
***REMOVED***

var DB *runner.DB
var RawDB *sql.DB

func newDB(***REMOVED*** (db *runner.DB, err error***REMOVED*** {
	dbConn := fmt.Sprintf("dbname=%s user=%s password=%s host=%s port=%s sslmode=disable", conf.DBName, conf.DBUser, conf.DBPwd, conf.DBHost, conf.DBPort***REMOVED***
	glog.Debug("Open db ", dbConn***REMOVED***
	rawDB, err := sql.Open(
		conf.DbType,
		dbConn,
	***REMOVED***
	if err != nil {
		glog.Error(err***REMOVED***
		return
	}

	// ensures the database can be pinged with an exponential backoff (15 min***REMOVED***
	runner.MustPing(rawDB***REMOVED***
	// set to reasonable values for production
	glog.Debug("setup DB connections"***REMOVED***
	rawDB.SetMaxIdleConns(4***REMOVED***
	rawDB.SetMaxOpenConns(32***REMOVED***

	// set this to enable interpolation
	dat.EnableInterpolation = true

	// set to check things like sessions closing.
	// Should be disabled in production/release builds.
	dat.Strict = true

	// Log any query over 10ms as warnings. (optional***REMOVED***
	runner.LogQueriesThreshold = 36 * time.Millisecond
	db = runner.NewDB(rawDB, "postgres"***REMOVED***
	glog.Debug("Open db success"***REMOVED***
	return db, err
}

func InitDB(***REMOVED*** (err error***REMOVED*** {
	glog.SetLevel(glog.DEBUG***REMOVED***
	glog.SetPre***REMOVED***x("DB"***REMOVED***
	glog.Info("Init DB"***REMOVED***
	DB, err = newDB(***REMOVED***;
	glog.Info("Init DB Done"***REMOVED***
	return
}


