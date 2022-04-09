package auth

import (
	"github.com/OpenCircuits/OpenCircuits/site/go/model"
	"github.com/gin-gonic/gin"
)

type anonAuthMethod struct{}

// NewAnonAuth Creates a new instance of the authentication method for user who aren't logged in
// TODO: This should be some UUID generated by the client and stored in a cookie or something.
func NewAnonAuth() AuthenticationMethod {
	return anonAuthMethod{}
}

func (anonAuthMethod) RegisterHandlers(*gin.Engine) {}
func (anonAuthMethod) ExtractIdentity(string) (model.UserID, error) {
	return model.AnonUserID, nil
}

func (anonAuthMethod) AuthHeaderPrefix() string {
	return "anon"
}
