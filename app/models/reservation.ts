import { ReservationComp, ReservationProps } from "~/components/Reservation";

export class Reservation {
    id: number;
    title: string;
    roomID: number;
    room: string;
    start: Date;
    end: Date;
    constructor(id: number, title: string, roomID:number, room: string, start: Date, end: Date) {
        this.id = id;
        this.title = title;
        this.roomID = roomID;
        this.room = room;
        this.start = start;
        this.end = end;
    }
    static empty = () => new Reservation(-1, "", -1, "", new Date(), new Date());

    isEmpty() {
        return this.id == -1 && this.title == "" && this.roomID == -1 && this.room == "" && this.start == null && this.end == null;
    }

    static factory(json: any): Reservation {
        if (json == null) {
            return Reservation.empty();
        }
        
        if (typeof(json) == "string") {
            json = JSON.parse(json);
            if (!json.title || !json.roomID || !json.room || !json.start || !json.end) {
                throw new Error("Invalid JSON: missing required fields");
            }
        }
        return new Reservation(json.id, json.title, json.roomID, json.room, new Date(json.start), new Date(json.end));
    }

    toString() {
        return `${this.title} in ${this.room} from ${this.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})} to ${this.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})}`;
    }
    render(timeOnly = true, showDetailButton = true) {
        return ReservationComp(this.toProps(), timeOnly, showDetailButton);
    }
    toProps(): ReservationProps {
        return {
            id: this.id,
            title: this.title,
            room: this.room,
            start: this.start,
            end: this.end
        }
    }

    isValid() {
        let valid = true;
        if (this.title == "") {
            valid = false;
        }
        if (this.roomID == -1) {
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