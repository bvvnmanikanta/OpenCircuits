package github

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/thedevsaddam/gojsonq/v2"
	"google.golang.org/api/oauth2/v2"
	"io/ioutil"
	"log"
	"net/http"
)

func getGithubClientID() string {

	//githubClientID, exists := os.LookupEnv("CLIENT_ID")
	//if !exists {
	//	log.Fatal("Github Client ID not defined in .env file")
	//}
	//
	//return githubClientID
	return "d745d362acc2ca6449a8"
}

func getGithubClientSecret() string {

	//githubClientSecret, exists := os.LookupEnv("CLIENT_SECRET")
	//if !exists {
	//	log.Fatal("Github Client ID not defined in .env file")
	//}
	//
	//return githubClientSecret
	return "84befc9a6b49f9ab49f207c65568967f7b00ba48"
}

// we do not need this in the non-local testing mode.
// Because our github client id will be in the environment from the very beginning
//func init() {
//	err := godotenv.Load(".env")
//	if err != nil {
//		log.Fatalf("ERROR loading .env")
//	}
//}

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
func New(c *gin.Context) {
	githubClientID := getGithubClientID()

	// Create the dynamic redirect URL for login
	redirectURL := fmt.Sprintf(
		"https://github.com/login/oauth/authorize?client_id=%s&redirect_uri=%s",
		githubClientID,
		"http://localhost:3000/api/login/github/callback",
	)
	c.Redirect(301, redirectURL)

}

func GithubCallbackHandler(c *gin.Context) {
	code := c.Query("code")

	githubAccessToken := getGithubAccessToken(code)

	githubData := getGithubData(githubAccessToken)

	loggedinHandler(c, githubData)
}
func loggedinHandler(c *gin.Context, githubData string) {
	if githubData == "" {
		// Unauthorized users get an unauthorized message
		c.JSON(200, gin.H{
			"message": "Unauthorized!",
		})
		return
	}
	name := gojsonq.New().FromString(githubData).Find("login")
	c.JSON(200, gin.H{
		"message": name,
	})

}
func getGithubAccessToken(code string) string {

	clientID := getGithubClientID()
	clientSecret := getGithubClientSecret()

	// Set us the request body as JSON
	requestBodyMap := map[string]string{
		"client_id":     clientID,
		"client_secret": clientSecret,
		"code":          code,
	}
	requestJSON, _ := json.Marshal(requestBodyMap)

	// POST request to set URL
	req, reqerr := http.NewRequest(
		"POST",
		"https://github.com/login/oauth/access_token",
		bytes.NewBuffer(requestJSON),
	)
	if reqerr != nil {
		log.Panic("Request creation failed")
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	// Get the response
	resp, resperr := http.DefaultClient.Do(req)
	if resperr != nil {
		log.Panic("Request failed")
	}

	// Response body converted to stringified JSON
	respbody, _ := ioutil.ReadAll(resp.Body)

	// Represents the response received from Github
	type githubAccessTokenResponse struct {
		AccessToken string `json:"access_token"`
		TokenType   string `json:"token_type"`
		Scope       string `json:"scope"`
	}

	// Convert stringified JSON to a struct object of type githubAccessTokenResponse
	var ghresp githubAccessTokenResponse
	err := json.Unmarshal(respbody, &ghresp)
	if err != nil {
		return ""
	}

	// Return the access token (as the rest of the
	// details are relatively unnecessary for us)
	return ghresp.AccessToken
}

func getGithubData(accessToken string) string {
	// Get request to a set URL
	req, reqerr := http.NewRequest(
		"GET",
		"https://api.github.com/user",
		nil,
	)
	if reqerr != nil {
		log.Panic("API Request creation failed")
	}

	// Set the Authorization header before sending the request
	// Authorization: token XXXXXXXXXXXXXXXXXXXXXXXXXXX
	authorizationHeaderValue := fmt.Sprintf("token %s", accessToken)
	req.Header.Set("Authorization", authorizationHeaderValue)

	// Make the request
	resp, resperr := http.DefaultClient.Do(req)
	if resperr != nil {
		log.Panic("Request failed")
	}

	// Read the response as a byte slice
	respbody, _ := ioutil.ReadAll(resp.Body)

	// Convert byte slice to string and return
	return string(respbody)
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
