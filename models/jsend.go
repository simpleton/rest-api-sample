package models

// JSend status codes
const (
	StatusSuccess = "success"
	StatusError   = "error"
	StatusFail    = "fail"
)

// A JResponseWriter interface extends http.ResponseWriter of go standard library
// to add utility methods for JSend format.
type JSendWriter interface {
	Data(interface{}) JSendWriter
	Message(string) JSendWriter
	Status(int) JSendWriter
}

type JSendResponse struct {
	RetStatus
}

func NewJsend() *JSendResponse {
	return new(JSendResponse)
}

// Data sets response's "data" field with given value.
func (self *JSendResponse) Data(data interface{}) *JSendResponse {
	self.RetStatus.Data = data;
	return self
}

// Message sets response's "message" field with given value.
func (self *JSendResponse) Message(msg string) *JSendResponse {
	self.RetStatus.Message = &msg
	return self
}

// Status sets http statusCode. It is a shorthand for "WriteHeader" method
// in order to keep method chaining.
func (self *JSendResponse) StatusCode(code int64) *JSendResponse {
	self.RetStatus.Code = &code
	self.RetStatus.Status = getStatus(code)
	return self
}

func getStatus(code int64) string {
	switch {
	case code >= 500:
		return StatusError
	case code >= 400 && code < 500:
		return StatusFail
	}
	return StatusSuccess
}