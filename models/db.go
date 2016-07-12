package models

import (
	"database/sql"

	_ "github.com/lib/pq"
	"gopkg.in/mgutz/dat.v1"
	"gopkg.in/mgutz/dat.v1/sqlx-runner"
	"time"
	"github.com/simpleton/tinker-api/conf"
	"fmt"
***REMOVED***

var DB *runner.DB

func newDB(***REMOVED*** (db *runner.DB, err error***REMOVED*** {
	rawDB, err := sql.Open(
		conf.DbType,
		fmt.Sprintf("dbname=%s user=%s password=%s host=%s sslmode=disable", conf.DbName, conf.DbUser, conf.DbPwd, conf.DbHost***REMOVED***,
	***REMOVED***
	if err != nil {
		return
	}
	// ensures the database can be pinged with an exponential backoff (15 min***REMOVED***
	runner.MustPing(rawDB***REMOVED***

	// set to reasonable values for production
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
	return db, err
}

func InitDB(***REMOVED*** (err error***REMOVED*** {
	DB, err = newDB(***REMOVED***;
	return
}

