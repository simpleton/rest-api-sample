package db

import (
	"fmt"
	glog "github.com/labstack/gommon/log"
	"crypto/sha256"
	"encoding/hex"
***REMOVED***

type User struct {
	ID         int64  `db:"f_id"`
	UserName   string `db:"f_user_name"`
	UserAvatar string `db:"f_user_avatar"`
	Email      string `db:"f_email"`
	Mobile     string `db:"f_mobile"`
	Password   string `db:"f_password"`
	Slat       string `db:"f_salt"`
	LockStatus int64  `db:"f_lock_state"`
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
		return true, fmt.Errorf("the user email already existed: %s", email***REMOVED***
	}
}

func CreateUser(username, password, email, salt string***REMOVED*** error {
	saltPassword := fmt.Sprintf("%s@%s", password, salt***REMOVED***
	hashPassword := sha256.Sum256([]byte(saltPassword***REMOVED******REMOVED***
	userData := User{
		UserName: username,
		Password: hex.EncodeToString(hashPassword[:]***REMOVED***,
		Email:    email,
		Slat:     salt,
	}
	err := DB.InsertInto("t_user"***REMOVED***.
		Blacklist("f_id"***REMOVED***.
		Record(userData***REMOVED***.
		Returning("f_id"***REMOVED***.
		QueryScalar(&userData.ID***REMOVED***
	glog.Info("CreateUser", userData***REMOVED***
	return err
}
