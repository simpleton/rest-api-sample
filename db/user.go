package db

import (
	"fmt"
	glog "github.com/labstack/gommon/log"
	"crypto/sha256"
	"encoding/hex"
	"gopkg.in/mgutz/dat.v1"
)

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

func LoginWithEmail(email, password string) (*User, error) {
	user := new(User)
	err := DB.Select("*").
		From("t_user").
		Where("f_email = $1", email).
		QueryStruct(user)
	if err == nil {
		if hashPassword(password, user.Slat) == user.Password {
			return user, nil
		} else {
			return nil, fmt.Errorf("password or username is incorrect.")
		}
	}
	return user, err
}

func CheckEmailExisted(email string) (bool, error) {
	var n int64
	err := DB.SQL("SELECT count(*) FROM t_user WHERE f_email=$1", email).QueryScalar(&n)
	if n == 0 {
		return false, err
	} else {
		return true, fmt.Errorf("the user email already existed: %s", email)
	}
}

func CreateUser(username, password, email, salt string) error {
	userData := User{
		UserName: username,
		Password: hashPassword(password, salt),
		Email:    email,
		Slat:     salt,
	}
	err := DB.InsertInto("t_user").
		Blacklist("f_id").
		Record(userData).
		Returning("f_id").
		QueryScalar(&userData.ID)
	glog.Info("CreateUser", userData)
	return err
}

func hashPassword(password, salt string) string {
	saltPassword := fmt.Sprintf("%s@%s", password, salt)
	hashPassword := sha256.Sum256([]byte(saltPassword))
	return hex.EncodeToString(hashPassword[:])
}
