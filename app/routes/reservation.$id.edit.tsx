import { Form, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getById } from "../api/reservation/get";

export const loader = async ({ params }:any) => {
  const contact = await getById(params.id);
  return {reservation: contact};
};

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const {reservation} = useLoaderData<typeof loader>();
    
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