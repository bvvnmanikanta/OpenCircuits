package main

import (
	"context"
	"flag"
	"net"
	"os"
	"strconv"

	"github.com/OpenCircuits/OpenCircuits/site/go/api"
	"github.com/OpenCircuits/OpenCircuits/site/go/api/auth"
	"github.com/OpenCircuits/OpenCircuits/site/go/api/auth/google"
	"github.com/OpenCircuits/OpenCircuits/site/go/api/ot/doc"
	"github.com/OpenCircuits/OpenCircuits/site/go/api/ot/session"
	"github.com/OpenCircuits/OpenCircuits/site/go/api/routes"
	"github.com/OpenCircuits/OpenCircuits/site/go/core"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/interfaces"
	"github.com/OpenCircuits/OpenCircuits/site/go/core/utils"
	"github.com/OpenCircuits/OpenCircuits/site/go/drivers/access"
	"github.com/OpenCircuits/OpenCircuits/site/go/drivers/circuit"
	"github.com/OpenCircuits/OpenCircuits/site/go/drivers/circuit/gcp_datastore"
	"github.com/OpenCircuits/OpenCircuits/site/go/drivers/circuit/sqlite"
	"github.com/OpenCircuits/OpenCircuits/site/go/web"
	"github.com/gin-gonic/contrib/sessions"
	"github.com/gin-gonic/gin"
)

func getPort() string {
	for port := 8080; port <= 65535; port++ {
		ln, err := net.Listen("tcp", ":"+strconv.Itoa(port))
		if err == nil {
			ln.Close()
			return strconv.Itoa(port)
		}
	}
	return "8080"
}

func main() {
	var err error

	// Parse flags
	googleAuthConfig := flag.String("google_auth", "", "<path-to-config>; Enables google sign-in API login")
	noAuthConfig := flag.Bool("no_auth", false, "Enables username-only authentication for testing and development")
	userCsifConfig := flag.String("interface", "sqlite", "The storage interface")
	sqlitePathConfig := flag.String("sqlitePath", "sql/sqlite", "The path to the sqlite working directory")
	dsEmulatorHost := flag.String("ds_emu_host", "", "The emulator host address for cloud datastore")
	dsProjectId := flag.String("ds_emu_project_id", "", "The gcp project id for the datastore emulator")
	ipAddressConfig := flag.String("ip_address", "0.0.0.0", "IP address of server")
	portConfig := flag.String("port", "8080", "Port to serve application, use \"auto\" to select the first available port starting at 8080")
	flag.Parse()

	// Bad way of registering if we're in prod and using gcp datastore and OAuth credentials
	if os.Getenv("DATASTORE_PROJECT_ID") != "" {
		*googleAuthConfig = "credentials.json"
		*userCsifConfig = "gcp_datastore"
	}

	// Register authentication method
	authManager := auth.AuthenticationManager{}
	if *googleAuthConfig != "" {
		authManager.RegisterAuthenticationMethod(google.New(*googleAuthConfig))
	}
	if *noAuthConfig {
		authManager.RegisterAuthenticationMethod(auth.NewNoAuth())
	}
	authManager.RegisterAuthenticationMethod(auth.NewAnonAuth())

	// Set up the storage interface
	var userCsif interfaces.CircuitStorageInterfaceFactory
	if *userCsifConfig == "mem" {
		userCsif = circuit.NewMemStorageInterfaceFactory()
	} else if *userCsifConfig == "sqlite" {
		userCsif, err = sqlite.NewInterfaceFactory(*sqlitePathConfig)
		core.CheckErrorMessage(err, "Failed to load sqlite instance:")
	} else if *userCsifConfig == "gcp_datastore_emu" {
		userCsif, err = gcp_datastore.NewEmuInterfaceFactory(context.Background(), *dsProjectId, *dsEmulatorHost)
		core.CheckErrorMessage(err, "Failed to load gcp datastore emulator instance:")
	} else if *userCsifConfig == "gcp_datastore" {
		userCsif, err = gcp_datastore.NewInterfaceFactory(context.Background())
		core.CheckErrorMessage(err, "Failed to load gcp datastore instance: ")
	}

	// TODO:
	docManager := doc.NewDocumentManager()
	sessManager := session.NewSessionManager(docManager)

	// Route through Gin
	router := gin.Default()
	router.Use(gin.Recovery())

	// Generate CSRF Token...
	store := sessions.NewCookieStore([]byte(utils.RandToken(64)))
	store.Options(sessions.Options{
		Path:   "/",
		MaxAge: 60 * 60 * 24 * 7,
	})
	router.Use(sessions.Sessions("opencircuitssession", store))

	// Setup authorization middleware
	router.Use(api.AuthMiddleware(authManager))

	// Register routes
	web.RegisterPages(router)
	routes.RegisterRoutes(router, userCsif, access.NewMem(), sessManager)

	// Check if portConfig is set to auto, if so find available port
	if *portConfig == "auto" {
		*portConfig = getPort()
	}

	router.Run(*ipAddressConfig + ":" + *portConfig)
}
