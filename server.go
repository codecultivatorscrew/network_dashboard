package main

import (
	"fmt"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	ws "github.com/gorilla/websocket"
	// "github.com/joho/godotenv"
)

func main() {

	// // err := godotenv.Load()
	// if err != nil {
	// 	log.Fatal("Error loading .env file")
	// }
	sigs := make(chan os.Signal, 1)
	done := make(chan bool, 1)

	// ticker := time.NewTicker(1000 * time.Millisecond)

	signal.Notify(sigs, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-sigs
		done <- true
	}()

	logManager, err := initLogs("./normal_output_01.log")
	if err != nil {
		log.Fatal(err)
	}
	defer logManager.closeLogs()

	// establish listening socket connection
	main_socket, err := create_main_connection(logManager)
	if err != nil {
		logManager.errorLog.Println(err.Error())
		os.Exit(1)
	}
	defer main_socket.Close()

	// start websocket server
	http.HandleFunc("/stream", func(w http.ResponseWriter, r *http.Request) {
		var upgrader = ws.Upgrader{}
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			logManager.errorLog.Println("upgrade:", err)
			os.Exit(1)
		}
		defer c.Close()
		for {
			mt, message, err := c.ReadMessage()
			if err != nil {
				logManager.errorLog.Println("read:", err)
				break
			}
			logManager.printExecLog(fmt.Sprintf("recv: %s, type: %d", message, mt))
			// write message to socket
			var nc net.Conn
			nc, err = get_new_socket(logManager)
			if err != nil {
				logManager.errorLog.Println(err.Error())
				break
			}
			defer nc.Close()
			var n int
			n, err = nc.Write([]byte(message))
			if err != nil {
				logManager.errorLog.Println("write:", err)
				break
			} else {
				logManager.printExecLog(fmt.Sprintf("sent %d bytes over new socket", n))
			}
		}
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		logManager.errorLog.Println(err.Error())
		os.Exit(1)
	}
}
