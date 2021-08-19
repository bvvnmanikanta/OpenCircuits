import {strict} from "assert";
import {Action, OTModel} from "./Interfaces";
import {ClientInfoProvider, OTDocument} from "./OTDocument";
import {Connection, ProposeEntry, Response, SessionJoined} from "./Protocol";

// The helper class for handling protocol messages
export class ClientSession<M extends OTModel> {
    private doc: OTDocument<M>;
    private conn: Connection<Action<M>>;
    private clientInfo: ClientInfoProvider

    private proposed?: ProposeEntry<Action<M>>;
    private session?: SessionJoined

    public constructor(doc: OTDocument<M>, conn: Connection<Action<M>>, clientInfo: ClientInfoProvider) {
        this.doc = doc;
        this.conn = conn;
        this.clientInfo = clientInfo;
        this.conn.OnMessage(m => this.handler(m));
    }

    private handler(m: Response<Action<M>>): void {
        switch (m.kind) {
            case "ProposeAck":
                // console.log("received ack message: " + JSON.stringify(m.AcceptedClock));
                this.AckHandler(m.AcceptedClock);
                break;
            case "Updates":
                // console.log("received new entries: " + JSON.stringify(m.Entries));
                this.doc.RecvRemote(m.NewEntries);
                break;
            case "WelcomeMessage":
                // console.log("received welcome message: " + JSON.stringify(m.MissedEntries));
                this.session = m.Session;
                this.doc.RecvRemote(m.MissedEntries);
                break;
            case "CloseMessage":
                console.log("Unexpected close message: " + JSON.stringify(m.Reason));
                break;
        }
    }

    public AckHandler(acceptedClock: number): void {
        strict.ok(this.proposed, "received unexpected ack message");
        strict.ok(this.session, "received unexpected ack message");
        this.doc.RecvLocal({
            Action: this.proposed.Action,
            ProposedClock: this.proposed.ProposedClock,
            AcceptedClock: acceptedClock,
            SchemaVersion: this.proposed.SchemaVersion,
            UserID: this.session.UserID,
            SessionID: this.session.SessionID,
        });

        // Send the next pending entry
        this.SendNext();
    }

    public SendNext(): boolean {
        const send = this.doc.SendNext();
        if (send == undefined) {
            return false;
        }

        this.proposed = {
            kind: "ProposeEntry",
            Action: send,
            ProposedClock: this.doc.Clock(),
            SchemaVersion: this.clientInfo.SchemaVersion(),
        }
        this.conn.Propose(this.proposed);
        return true;
    }

    public Session(): SessionJoined | undefined {
        return this.session;
    }
}