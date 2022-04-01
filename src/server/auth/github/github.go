package github

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"log"

	"github.com/OpenCircuits/OpenCircuits/site/go/auth"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"google.golang.org/api/oauth2/v2"
	"google.golang.org/api/option"
)

// we do not need this in the non-local testing mode.
// Because our github client id will be in the environment from the very beginning
func init() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("ERROR loading .env")
	}
}

type authenticationMethod struct {
	config  oauth2ConfigWrapper
	service *oauth2.Service
}

// Credentials which stores github ids.
type oauth2Config struct {
	ClientID  string `json:"client_id"`
	ProjectID string `json:"project_id"`
}
type oauth2ConfigWrapper struct {
	Web oauth2Config `json:"web"`
}

func (g authenticationMethod) RegisterHandlers(engine *gin.Engine) {
}

// New Creates a new instance of the Github authentication method with the provided config path
// ConfigPath is a json file
func New(configPath string) auth.AuthenticationMethod {
	file, err := ioutil.ReadFile(configPath)
	if err != nil {
		log.Printf("File error: %v\n", err)
		panic(err)
	}

	var cred oauth2ConfigWrapper
	err = json.Unmarshal(file, &cred)
	if err != nil {
		log.Printf("Error unmarshalling credentials json: %v\n", err)
		panic(err)
	}

	// The IdToken endpoint does not need authentication
	oauth2Service, err := oauth2.NewService(context.Background(), option.WithoutAuthentication())
	if err != nil {
		panic(err)
	}

	return authenticationMethod{
		service: oauth2Service,
		config:  cred,
	}
}

func (g authenticationMethod) ExtractIdentity(token string) (string, error) {
	// This is poorly documented, so the code for verifying a token is credit to
	// https://stackoverflow.com/a/36717411/2972004
	// NOTE: This should be replaced with manual JWT verification. This endpoint
	//	is only designed for debugging and validation
	tokenInfo, err := g.service.Tokeninfo().IdToken(token).Do()
	if err != nil {
		return "", err
	}
	if tokenInfo.IssuedTo != g.config.Web.ClientID {
		return "", errors.New("invalid audience")
	}
	return "github_" + tokenInfo.UserId, nil
}

func (g authenticationMethod) AuthHeaderPrefix() string {
	return "github"
}
