import { fromDatetimeLocal } from "~/utils/datetime";
import "./Reservation.css";
import { Link } from "@remix-run/react";
interface ReservationProps {
    id: number;
    title: string;
    room: string;
    start: Date;
    end: Date;
}
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

    static fromJSON(json: any): Reservation | null{
        if (json == null) {
            return null;
        }
        if (typeof(json) == "string") {
            json = JSON.parse(json);
            if (!json.title || !json.room || !json.start || !json.end) {
                throw new Error("Invalid JSON: missing required fields");
            }
        }
        return new Reservation(json.id, json.title, json.room_id, json.room, new Date(json.start), new Date(json.end));
    }

    toString() {
        return `${this.title} in ${this.room} from ${this.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})} to ${this.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})}`;
    }
    render() {
        return <ReservationComp id={this.id} title={this.title} room={this.room} start={this.start} end={this.end} />;
    }
}

const ReservationComp = (props: ReservationProps, timeOnly = false) => {
    if (timeOnly) {
        //time with hours and minutes (no seconds)
        var start = props.start.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
        var end = props.end.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
    } else {
        //full date and time with hours and minutes (no seconds)
        var start = props.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
        var end = props.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
    }
    return <>
        <div className="event" key="{props.title}">
            <h1 key="title"><u>{props.title}</u> in {props.room}</h1>
            <h2 key="time">{start} - {end}</h2>
            <Link to={`/reservation/${props.id}`}>Details</Link>
            <Link to={`/reservation/${props.id}/edit`}>Edit</Link>
        </div>
    </>
}