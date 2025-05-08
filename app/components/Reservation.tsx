import { fromDatetimeISO, toDatetimeISO } from "~/utils/datetime";
import "./Reservation.css";
import { Form, Link } from "@remix-run/react";
import { ChangeEventHandler, FormEventHandler } from "react";
import { getRooms } from "~/api/room";
import { Room } from "~/models/room";
export interface ReservationProps {
    id: number;
    title: string;
    room: string;
    start: Date;
    end: Date;
}

export const ReservationComp = (props: ReservationProps, timeOnly = false, showDetailButton = false) => {
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
    rooms: Room[];
    title: string;
    roomID: string;
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
                {props.rooms.map((room) => (
                    <option key={room.id} value={room.id}>{room.name} ({room.department})</option>
                ))}
            </select>
            <input title="start-date" name="start-date" type="date" defaultValue={toDatetimeISO(props.start).split("T")[0]}/>
            <input title="start-time" name="start-time" type="time" defaultValue={toDatetimeISO(props.start).split("T")[1]}/>
            <input title="duration" name="duration" type="number" max={240} min={15} defaultValue={props.duration}/>
            <button type="submit">Submit</button>
        </Form>
}
