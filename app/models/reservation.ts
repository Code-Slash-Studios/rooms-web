import { ReservationComp, ReservationProps } from "~/components/Reservation";

/**
 * Defines a reservation object.
 * @param id - The ID of the reservation
 * @param name - The name of the reservation
 * @param roomID - The ID of the room reserved
 * @param userID - The ID of the user who made the reservation
 * @param start - The start time of the reservation
 * @param end - The end time of the reservation
 * 
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
    static fromJSON(json: {id:number, name:string, room_id:string, user_id:string, start:Date, end:Date} | string): Reservation {
        //for processing single reservation
        if (typeof json === "string") {
            const parse = JSON.parse(json);
            //check if the parsed json is an array
            if (Array.isArray(parse)) {
                throw new Error("Expected a single reservation object, but got an array");
            }
            if (!parse.id || !parse.name || !parse.room_id || !parse.user_id || !parse.start || !parse.end) {
                throw new Error("Invalid reservation data");
            }
            const data: {id:number, name:string, room_id:string, user_id:string, start:Date, end:Date} = parse;
            json = data;
        }
        return new Reservation(json.id, json.name, json.room_id, json.user_id, new Date(json.start), new Date(json.end));
    }

    static factory(json: string[]): Reservation[] {
        //for processing multiple reservations
        const reservations = json.map((reservation) => {
            const r = JSON.parse(reservation);
            if (!r.id || !r.name || !(r.room_id || r.roomID) || !(r.user_id || r.roomID) || !r.start || !r.end) {
                throw new Error("Invalid reservation data");
            }
            return new Reservation(r.id, r.name, r.room_id || r.roomID, r.user_id || r.userID, new Date(r.start), new Date(r.end));
        })
        return reservations;
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