package db

import (
	"database/sql"

	_ "github.com/lib/pq"
	"gopkg.in/mgutz/dat.v1"
	"gopkg.in/mgutz/dat.v1/sqlx-runner"
	"time"
	"github.com/simpleton/rest-api-sample/conf"
	"fmt"
	glog "github.com/labstack/gommon/log"
)

var DB *runner.DB
var RawDB *sql.DB

func newDB() (db *runner.DB, err error) {
	dbConn := fmt.Sprintf("dbname=%s user=%s password=%s host=%s port=%s sslmode=disable", conf.DBName, conf.DBUser, conf.DBPwd, conf.DBHost, conf.DBPort)
	glog.Debug("Open db ", dbConn)
	rawDB, err := sql.Open(
		conf.DbType,
		dbConn,
	)
	if err != nil {
		glog.Error(err)
		return
	}

	// ensures the database can be pinged with an exponential backoff (15 min)
	runner.MustPing(rawDB)
	// set to reasonable values for production
	glog.Debug("setup DB connections")
	rawDB.SetMaxIdleConns(4)
	rawDB.SetMaxOpenConns(32)

	// set this to enable interpolation
	dat.EnableInterpolation = true

	// set to check things like sessions closing.
	// Should be disabled in production/release builds.
	dat.Strict = true

	// Log any query over 10ms as warnings. (optional)
	runner.LogQueriesThreshold = 36 * time.Millisecond
	db = runner.NewDB(rawDB, "postgres")
	glog.Debug("Open db success")
	return db, err
}

func InitDB() (err error) {
	glog.SetLevel(glog.DEBUG)
	glog.Info("Init DB")
	DB, err = newDB();
	glog.Info("Init DB Done")
	return
}


