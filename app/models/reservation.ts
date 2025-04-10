import { ReservationComp, ReservationProps } from "~/components/Reservation";

/**
 * Current API output
 * [
  {
    "id": 1,
    "room_id": "W211",
    "name": "Code Slash Meeting",
    "user_id": "caldweln",
    "start": "2025-04-07T12:00:00Z",
    "end": "2025-04-07T12:45:00Z"
  }
]
 */

export class Reservation {
    id: number;
    name: string;
    roomID: string;
    userID: string;
    start: Date;
    end: Date;
    constructor(id: number, name: string, roomID:string, userID:string, start: Date, end: Date) {
        this.id = id;
        this.name = name;
        this.roomID = roomID;
        this.userID = userID;
        this.start = start;
        this.end = end;
    }
    static empty = () => new Reservation(-1, "", "", "", new Date(), new Date());

    isEmpty() {
        return this.id == -1 && this.name == "" && this.roomID == "" && this.start == null && this.end == null;
    }

    static factory(json: any): Reservation {
        if (json == null) {
            return Reservation.empty();
        }
        
        if (typeof(json) == "string") {
            json = JSON.parse(json);
            if (!json.name || !json.room_id || !json.start || !json.end || !json.user_id) {
                throw new Error("Invalid JSON: missing required fields");
            }
        }
        return new Reservation(json.id, json.name, json.room_id, json.user_id, new Date(json.start), new Date(json.end));
    }

    toJSON() {
        // "id": 1,
        // "room_id": "W211",
        // "name": "Code Slash Meeting",
        // "user_id": "caldweln",
        // "start": "2025-04-07T12:00:00Z",
        // "end": "2025-04-07T12:45:00Z"
        return JSON.stringify({
            id: this.id,
            room_id: this.roomID,
            name: this.name,
            user_id: "caldweln",
            start: this.start.toISOString(),
            end: this.end.toISOString()
        });
    }

    toString() {
        return `${this.name} in ${this.roomID} from ${this.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})} to ${this.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})}`;
    }
    render(timeOnly = true, showDetailButton = true) {
        return ReservationComp(this.toProps(), timeOnly, showDetailButton);
    }
    toProps(): ReservationProps {
        return {
            id: this.id,
            title: this.name,
            room: this.roomID,
            start: this.start,
            end: this.end
        }
    }

    isValid() {
        let valid = true;
        if (this.name == "") {
            valid = false;
        }
        if (this.roomID == "") {
            valid = false;
        }
        if (this.start == null) {
            valid = false;
        }
        if (this.end == null) {
            valid = false;
        }
        if (this.start >= this.end) {
            valid = false;
        }
        return valid;
    }
}