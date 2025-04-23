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
    static fromJSON(json: any): Reservation {
        //for processing single reservation
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        //check if the parsed json is an array
        if (Array.isArray(json)) {
            throw new Error("Expected a single reservation object, but got an array");
        }
        this.validateObject(json);

        return new Reservation(json.id, json.name, json.room_id, json.user_id, new Date(json.start), new Date(json.end));
    }

    static factory(json: any[]): Reservation[] {
        //for processing multiple reservations
        const reservations = json.map((r: any) => {
            if (typeof r === "string") {
                r = JSON.parse(r);
            }
            this.validateObject(r);
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
            user_id: this.userID,
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
    static validateObject(obj: any) {
        if (!obj.id || !obj.name || !obj.room_id || !obj.user_id || !obj.start || !obj.end) {
            throw new Error("Invalid reservation data");
        }
    }
    isValid() {
        let valid = true;
        let message = "Reservation is valid";
        if (this.name.trim() == "") {
            valid = false;
            message = "Name is Required.";
        }
        else if (this.roomID == "") {
            valid = false;
            message = "Room is required";
        }
        else if (this.start == null) {
            valid = false;
            message = "Start time is required";
        }
        else if (this.end == null) {
            valid = false;
            message = "End time is required";
        }
        else if (this.start >= this.end) {
            valid = false;
            message = "Start time must be before end time";
        }
        else if (this.name.length > 100) {
            valid = false;
            message = "Reservation name has a maximum length of 100 characters";
        }
        return {valid, message: message};
    }
}