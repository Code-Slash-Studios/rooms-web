import { Form } from "@remix-run/react";
import { useState } from "react";

export default function EditReservation(props:any) {
    //displays a react component that allows the user to edit a reservation
    const [title, setTitle] = useState("");
    const [room, setRoom] = useState("");
    const [start, setStart] = useState(new Date());
    const [end, setEnd] = useState(new Date());
    return (
        <Form method="POST">
            <input title="title" name="title" type="text"/>
            <input title="room" name="room" type="text"/>
            <input title="start" name="start" type="datetime-local"/>
            <input title="end" name="end" type="datetime-local"/>
        </Form>
    );
}