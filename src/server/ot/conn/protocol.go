package conn

import (
	"encoding/json"
	"errors"
	"fmt"

	"github.com/OpenCircuits/OpenCircuits/site/go/model"
	"github.com/OpenCircuits/OpenCircuits/site/go/ot/doc"
)

//
// Types in this file are mirrored in ot/Protocol.ts
//

type RawMessageWrapper struct {
	Type string
	Msg  json.RawMessage
}

//
// Message sent TO the client
//

type (
	WelcomeMessage = doc.WelcomeMessage
)

type CloseMessage struct {
	Reason string
}

type Updates struct {
	AcceptedClock  uint64
	NewEntries     []doc.AcceptedEntry
	SessionsJoined []doc.SessionJoined
	SessionsLeft   []doc.SessionLeft
}

func Serialize(s interface{}) ([]byte, error) {
	var t string
	switch s.(type) {
	case WelcomeMessage:
		t = "WelcomeMessage"
	case Updates:
		t = "Updates"
	case CloseMessage:
		t = "CloseMessage"
	default:
		return nil, errors.New("serialized invalid type (INTERNAL PROTOCOL VIOLATION)")
	}

	rawMsg, err := json.Marshal(s)
	if err != nil {
		return nil, err
	}
	return json.Marshal(RawMessageWrapper{t, rawMsg})
}

//
// Messages sent FROM the client
//

type ProposeEntry struct {
	Action        json.RawMessage
	ProposedClock uint64
	SchemaVersion model.SchemaVersion
}

type JoinDocument struct {
	LogClock uint64
	AuthType string
	AuthID   string
}

func Deserialize(data []byte) (interface{}, error) {
	var rawMsg RawMessageWrapper
	err := json.Unmarshal(data, &rawMsg)
	if err != nil {
		return nil, err
	}

	t := rawMsg.Type
	switch {
	case t == "ProposeEntry":
		var m ProposeEntry
		err := json.Unmarshal(rawMsg.Msg, &m)
		return m, err
	case t == "JoinDocument":
		var m JoinDocument
		err := json.Unmarshal(rawMsg.Msg, &m)
		return m, err
	default:
		return nil, errors.New(fmt.Sprint("received invalid message kind: ", rawMsg))
	}
}
