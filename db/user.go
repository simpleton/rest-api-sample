package db

import (
	glog "github.com/labstack/gommon/log"
	"fmt"
***REMOVED***

type User struct {
	ID         int64  `db:"f_id"`
	UserName   string `db:"f_user_name"`
	UserAvatar int64  `db:"f_user_avatar"`
	Email      string `db:"f_email"`
	Mobile     string `db:"f_mobile"`
	Password   string `db:"f_password"`
	Slat       string `db:"f_salt"`
}

func GetUserByEmail(email string***REMOVED*** (*User, error***REMOVED*** {
	user := new(User***REMOVED***
	err := DB.Select("*"***REMOVED***.
		From("f_user"***REMOVED***.
		Where("f_email = $1", email***REMOVED***.
		QueryStruct(user***REMOVED***
	return user, err
}

func CheckEmailExisted(email string***REMOVED*** (bool, error***REMOVED*** {
	var n int64
	err := DB.SQL("SELECT count(****REMOVED*** FROM t_user WHERE f_email=$1", email***REMOVED***.QueryScalar(&n***REMOVED***
	if n == 0 {
		return false, err
	} ***REMOVED*** {
		return true, err
	}
}

func CreateUser(username, password, email, salt string***REMOVED*** error {
	password = fmt.Sprintf("%s:%s", password, salt***REMOVED***
	userData := User{
		UserName: username,
		Password: password,
		Email: email,
		Slat: salt,
	}
	err := DB.InsertInto("payments"***REMOVED***.
		Blacklist("f_id"***REMOVED***.
		Record(userData***REMOVED***.
		Returning("id"***REMOVED***.
		QueryScalar(&userData***REMOVED***
	glog.Info("Init DB Done"***REMOVED***
	return err
}
