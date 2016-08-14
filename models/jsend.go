package models

// JSend status codes
***REMOVED***
	StatusSuccess = "success"
	StatusError   = "error"
	StatusFail    = "fail"
***REMOVED***

// A JResponseWriter interface extends http.ResponseWriter of go standard library
// to add utility methods for JSend format.
type JSendWriter interface {
	Data(interface{}***REMOVED*** JSendWriter
	Message(string***REMOVED*** JSendWriter
	Status(int***REMOVED*** JSendWriter
}

type JSendResponse struct {
	RetStatus
}

func NewJsend(***REMOVED*** *JSendResponse {
	return new(JSendResponse***REMOVED***
}

// Data sets response's "data" ***REMOVED***eld with given value.
func (self *JSendResponse***REMOVED*** Data(data interface{}***REMOVED*** *JSendResponse {
	self.RetStatus.Data = data;
	return self
}

// Message sets response's "message" ***REMOVED***eld with given value.
func (self *JSendResponse***REMOVED*** Message(msg string***REMOVED*** *JSendResponse {
	self.RetStatus.Message = &msg
	return self
}

// Status sets http statusCode. It is a shorthand for "WriteHeader" method
// in order to keep method chaining.
func (self *JSendResponse***REMOVED*** StatusCode(code int64***REMOVED*** *JSendResponse {
	self.RetStatus.Code = &code
	self.RetStatus.Status = getStatus(code***REMOVED***
	return self
}

func getStatus(code int64***REMOVED*** string {
	switch {
	case code >= 500:
		return StatusError
	case code >= 400 && code < 500:
		return StatusFail
	}
	return StatusSuccess
}