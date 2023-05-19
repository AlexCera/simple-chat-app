package main

import (
	"log"
	"net/http"

	gosocketio "github.com/graarh/golang-socketio"
	"github.com/graarh/golang-socketio/transport"
)

type Message struct {
	Id   string `json:"id"`
	Body string `json:"body"`
}

func main() {
	/* Start socket server */
	server := gosocketio.NewServer(transport.GetDefaultWebsocketTransport())

	/* Connection ready */
	server.On(gosocketio.OnConnection, func(c *gosocketio.Channel) {
		//join them to room
		c.Join("chat")
	})

	/* Event Send */
	server.On("send", func(c *gosocketio.Channel, msg Message) string {
		//send event to all in room
		c.BroadcastTo("chat", "reply", msg)
		return ""
	})

	//Http server
	serveMux := http.NewServeMux()
	serveMux.Handle("/socket.io/", server)
	serveMux.Handle("/", http.FileServer(http.Dir("./public")))
	log.Panic(http.ListenAndServe(":8000", serveMux))
}
