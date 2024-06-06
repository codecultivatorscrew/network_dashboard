package main

import (
	"net"
)

func create_main_connection(l *LogManager) (net.Conn, error) {
	var connection net.Conn
	var err error
	var server_available bool = false
	for !server_available {
		connection, err = net.Dial("tcp", "localhost:5001")
		if err != nil {
			l.errorLog.Println("Error opening connection to the main socket.")
			l.errorLog.Println(err.Error())
			return nil, err
		} else {
			server_available = true
		}
	}
	var connected bool = false
	for !connected {
		_, err = connection.Write([]byte("[syn]\x00"))
		if err != nil {
			l.printExecLog("Error writing to the main socket.")
			l.errorLog.Println(err.Error())
			continue
		}
		response := make([]byte, 1024)
		_, err = connection.Read(response)
		if err != nil {
			l.printExecLog("Error reading from the main socket.")
			l.errorLog.Println(err.Error())
			continue
		}
		if string(response) == "[ack]\x00" {
			connected = true
		}
	}
	return connection, nil
}

func get_new_socket(l *LogManager) (net.Conn, error) {
	var connection net.Conn
	var err error
	var server_available bool = false
	for !server_available {
		connection, err = net.Dial("tcp", "localhost:5001")
		if err != nil {
			l.errorLog.Println("Error opening connection to the socket.")
			l.errorLog.Println(err.Error())
			return nil, err
		} else {
			server_available = true
		}
	}
	return connection, nil
}
