package main

import (
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	ws "github.com/gorilla/websocket"
	// "github.com/joho/godotenv"
)

var upgrader = ws.Upgrader{}

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
	mainSocket, err := create_main_connection(logManager)
	if err != nil {
		logManager.errorLog.Println(err.Error())
		os.Exit(1)
	}
	defer mainSocket.Close()

	// establish secondary socket connection
	secondarySocket, err := get_new_socket(logManager)
	if err != nil {
		logManager.errorLog.Println(err.Error())
		os.Exit(1)
	}

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		handleWebSocket(logManager, mainSocket, secondarySocket, w, r)
	})

	err = http.ListenAndServe(":8080", nil)
	if err != nil {
		logManager.errorLog.Println(err.Error())
		os.Exit(1)
	}

	<-done
	log.Println("Server shutting down.")
}

func handleWebSocket(logManager *LogManager, mainSocket net.Conn, secondarySocket net.Conn, w http.ResponseWriter, r *http.Request) {
	wsConn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		logManager.errorLog.Println("Failed to upgrade HTTP to WebSocket:", err)
		return
	}
	defer wsConn.Close()

	tcpToWebSocket := make(chan []byte)
	go readFromTCP(mainSocket, tcpToWebSocket, logManager)

	for {
		select {
		case message := <-tcpToWebSocket:
			err := wsConn.WriteMessage(ws.TextMessage, message)
			if err != nil {
				logManager.errorLog.Println("Error writing to WebSocket:", err)
				return
			}
		default:
			_, message, err := wsConn.ReadMessage()
			if err != nil {
				logManager.errorLog.Println("Error reading from WebSocket:", err)
				return
			}
			_, err = secondarySocket.Write(message)
			if err != nil {
				logManager.errorLog.Println("Error writing to TCP socket:", err)
				return
			}
		}
	}
}

func readFromTCP(conn net.Conn, ch chan<- []byte, logManager *LogManager) {
	buffer := make([]byte, 4096)
	for {
		n, err := conn.Read(buffer)
		if err != nil {
			logManager.errorLog.Println("Error reading from TCP socket:", err)
			close(ch)
			return
		}
		ch <- buffer[:n]
	}
}
