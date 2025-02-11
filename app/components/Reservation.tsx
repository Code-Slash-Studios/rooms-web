import { fromDatetimeLocal, toDatetimeLocal } from "~/utils/datetime";
import "./Reservation.css";
import { Form, Link } from "@remix-run/react";
import { ChangeEventHandler, FormEventHandler } from "react";
import { getRooms } from "~/api/room";
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

    static factory(json: any): Reservation | Reservation[] | null | any { //recursive
        if (json == null) {
            return null
        }
        if (typeof(json) == "string") {
            json = JSON.parse(json);
            if (!json.title || !json.room || !json.start || !json.end) {
                throw new Error("Invalid JSON: missing required fields");
            }
        }
        if (Array.isArray(json)) {
            return json.map((r: any) => {return Reservation.factory(r)});
        } else {
            return new Reservation(json.id, json.title, json.roomID, json.room, new Date(json.start), new Date(json.end));
        }
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

const ReservationComp = (props: ReservationProps, timeOnly = false, showDetailButton = false) => {
    if (timeOnly) {
        //time with hours and minutes (no seconds)
        var start = props.start.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
        var end = props.end.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
    } else {
        //full date and time with hours and minutes (no seconds)
        var start = props.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
        var end = props.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
    }
    const linkto = "/reservation/" + props.id;
    return <Link to={linkto} key="{props.title}" style={{textDecoration:"none",color:"inherit"}}><div className="event" key="{props.title}">
        <h1 key="title"><u>{props.title}</u> in {props.room}</h1>
        <h2 key="time">{start} - {end}</h2>
        {showDetailButton && <Link key="detail" to={`/reservation/${props.id}`}><button>Details</button></Link>}
        <Link key="edit" to={`/reservation/${props.id}/edit`}><button>Edit</button></Link>
    </div></Link>
}

interface ReservationFormProps {
    title: string;
    roomID: number;
    start: Date;
    end: Date;
    duration: number;
    onSelect: ChangeEventHandler<HTMLSelectElement>;
    onChange: FormEventHandler<HTMLFormElement>;
    onSubmit: FormEventHandler<HTMLFormElement>;
}


export const ReservationFormComp = (props: ReservationFormProps) => {
    return <Form method="PUT" onChange={props.onChange} onSubmit={props.onSubmit} className="reservationForm">
            <input title="title" name="title" type="text" defaultValue={props.title}/>
            <select title="room" name="room" value={props.roomID} onChange={(e) => {props.onSelect(e)}}>
                <option value={-1}>Select a room</option>
                {Array.from(getRooms().entries()).map(([id, room]) => (
                    <option key={id} value={id}>{room}</option>
                ))}
            </select>
            <input title="start-date" name="start-date" type="date" defaultValue={toDatetimeLocal(props.start).split("T")[0]}/>
            <input title="start-time" name="start-time" type="time" defaultValue={toDatetimeLocal(props.start).split("T")[1]}/>
            <input title="duration" name="duration" type="number" max={240} min={15} defaultValue={props.duration}/>
            <button type="submit">Submit</button>
        </Form>
}
