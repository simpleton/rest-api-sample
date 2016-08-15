package db

import (
	"fmt"
	glog "github.com/labstack/gommon/log"
	"crypto/sha256"
	"encoding/hex"
	"gopkg.in/mgutz/dat.v1"
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
	UpdatedAt  dat.NullTime  `db:"f_updated_timestamp"`
	CreatedAt  dat.NullTime  `db:"f_created_timestamp"`
}

func LoginWithEmail(email, password string***REMOVED*** (*User, error***REMOVED*** {
	user := new(User***REMOVED***
	err := DB.Select("*"***REMOVED***.
		From("t_user"***REMOVED***.
		Where("f_email = $1", email***REMOVED***.
		QueryStruct(user***REMOVED***
	if err == nil {
		if hashPassword(password, user.Slat***REMOVED*** == user.Password {
			return user, nil
		} ***REMOVED*** {
			return nil, fmt.Errorf("password or username is incorrect."***REMOVED***
		}
	}
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
	userData := User{
		UserName: username,
		Password: hashPassword(password, salt***REMOVED***,
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

func hashPassword(password, salt string***REMOVED*** string {
	saltPassword := fmt.Sprintf("%s@%s", password, salt***REMOVED***
	hashPassword := sha256.Sum256([]byte(saltPassword***REMOVED******REMOVED***
	return hex.EncodeToString(hashPassword[:]***REMOVED***
}
