package models

type User struct {
	UserName  string `json:"user_name"`
	Email     string `json:"email"`
	Mobile    string `json:"mobile,omitempty"`
	AuthToken string `json:"-"`
}

type UserLogin struct {
	UserName string `json:"user_name"`
	Password string `json:"password"`
}
