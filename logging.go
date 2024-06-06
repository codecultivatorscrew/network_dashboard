package main

import (
	"log"
	"os"
	// "time"
)

type LogManager struct {
	eLogFile  *os.File
	exLogFile *os.File
	errorLog  *log.Logger
	execLog   *log.Logger
}

func initLogs(exLogName string) (*LogManager, error) {
	var l LogManager
	//create your file with desired read/write permissions
	errorLogFile, fileOpenError := os.OpenFile("./errors.log", os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0644)
	if fileOpenError != nil {
		log.Fatal(fileOpenError)
	}
	execLogFile, fileOpenError := os.OpenFile(exLogName, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0644)
	if fileOpenError != nil {
		log.Fatal(fileOpenError)
	}
	l.eLogFile = errorLogFile
	l.exLogFile = execLogFile
	//set output of logs to files
	l.errorLog = log.New(l.eLogFile, log.Prefix(), log.Flags())
	l.execLog = log.New(l.exLogFile, log.Prefix(), log.Flags())

	return &l, nil
}

func (l *LogManager) closeLogs() {
	l.eLogFile.Close()
	l.exLogFile.Close()
}

func (l *LogManager) printExecLog(message string) {
	if os.Getenv("ENVIRONMENT") == "development" {
		l.execLog.Println(message)
	}
}
