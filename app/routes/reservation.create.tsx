import { Form, useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { post } from "~/api/reservation";
import { Reservation } from "~/components/Reservation";
import { toDatetimeLocal } from "~/utils/datetime";

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const [title, setTitle] = useState("");
    const [room, setRoom] = useState("");
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());

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
        post(new Reservation(-1, title, room, start, end)).then((res) => {
            
        });

    }

    return (
        <div>
            <h1 key="title">Create Reservation</h1>
            <Form method="POST" onChange={handleChange} onSubmit={handleSubmit}>
                <input title="title" name="title" type="text" defaultValue={title}/>
                <input title="room" name="room" type="text" defaultValue={room}/>
                <input title="start" name="start" type="datetime-local" defaultValue={toDatetimeLocal(start)}/>
                <input title="end" name="end" type="datetime-local" defaultValue={toDatetimeLocal(end)}/>
                <button type="submit">Submit</button>
            </Form>
        </div>
    );
}