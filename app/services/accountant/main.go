package main

import (
	"fmt"
	"os"

	"github.com/aforamitdev/kuber/foundation/logger"
	"go.uber.org/zap"
)

func main() {
	log, err := logger.New("KUBER-ACCOUNT-API")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer log.Sync()

	if err := run(log); err != nil {
		log.Errorw("startup", "ERROR RUNNING APP ", err)
		log.Sync()
		os.Exit(1)
	}
}

func run(log *zap.SugaredLogger) error {
	log.Infof("STARTING APP")
	return nil
}
