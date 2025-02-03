import { Form, useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { getById } from "~/api/reservation/get";
import { post } from "~/api/reservation/post";
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
    const [room, setRoom] = useState("");
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
                setRoom(event.target.value);
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
        post(new Reservation(reservation.id, title, room, start, end)).then((res) => {
            
        });

    }

    return (
        <Form method="POST" onChange={handleChange} onSubmit={handleSubmit}>
            <input title="title" name="title" type="text" defaultValue={title}/>
            <input title="room" name="room" type="text" defaultValue={room}/>
            <input title="start" name="start" type="datetime-local" defaultValue={toDatetimeLocal(start)}/>
            <input title="end" name="end" type="datetime-local" defaultValue={toDatetimeLocal(end)}/>
            <button type="submit">Submit</button>
        </Form>
    );
}