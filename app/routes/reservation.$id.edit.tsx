import { Form, useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { getById, post } from "~/api/reservation";
import { Reservation } from "~/components/Reservation";
import { toDatetimeLocal } from "~/utils/datetime";

export const loader = async ({ params }:any) => {
    return getById(params.id).then((res) => {
        if (res == undefined) {
            console.error("No reservation found");
            return {"reservation": undefined, "getError": "No reservation found"};
        }
        return {"reservation": res, "getError": undefined};
    });
  
};

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const {reservation, getError} = useLoaderData<typeof loader>();
    
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState(-1);
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());

    useEffect(() => {
        if (reservation != undefined) {
            setTitle(reservation.title);
            setRoom(reservation.room);
            setStart(reservation.start);
            setEnd(reservation.end);
        }
    }, [reservation]);

    const handleChange: FormEventHandler<HTMLFormElement> = (event: any) => {
        switch(event.target.title) {
            case "title":
                setTitle(event.target.value);
                break;
            case "room":
                setRoomID(event.target.value);
                break;
            case "start":
                if (event.target.value > end) {
                    setEnd(start);
                }
                setStart(event.target.value);
                break;
            case "end":
                if (event.target.value < start) {
                    setEnd(start);
                }
                setEnd(event.target.value);
                break;
        }
    }
    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any) => {
        event.preventDefault();
        console.log(title, room, start, end);
        if (!reservation) {
            console.error("No reservation found");
            return;
        }
        post(new Reservation(reservation.id, title, roomID, room, start, end)).then((res) => {
            
        });

    }

    return (
        <div>
            <h1 key="title">Edit Reservation</h1>
            <Form method="PUT" onChange={handleChange} onSubmit={handleSubmit}>
                <input title="title" name="title" type="text" defaultValue={title}/>
                <select title="room" name="room" defaultValue={roomID}>
                    <option value={-1}>Select a room</option>
                    <option value={1}>W210</option>
                    <option value={2}>W211</option>
                    <option value={3}>W212</option>
                </select>
                <input title="start" name="start" type="datetime-local" defaultValue={toDatetimeLocal(start)}/>
                <input title="end" name="end" type="datetime-local" defaultValue={toDatetimeLocal(end)}/>
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}