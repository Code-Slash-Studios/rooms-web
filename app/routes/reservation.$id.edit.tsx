import { Form, useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { getById } from "~/api/reservation/get";
import { Reservation } from "~/components/Reservation";

export const loader = async ({ params }:any) => {
  const contact: Reservation | undefined = await getById(params.id);
  return {"reservation": contact};
};

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const {reservation} = useLoaderData<typeof loader>();
    
    const [title, setTitle] = useState("");
    const [room, setRoom] = useState("");
    const [start, setStart] = useState(new Date().getTime());
    const [end, setEnd] = useState(new Date().getTime());

    const awaitFetch = useEffect(() => {
        if (reservation) {
            setTitle(reservation.title);
            setRoom(reservation.room);
            setStart(reservation.start.getTime());
            setEnd(reservation.end.getTime());
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
        //fetch to api/reservation/update/id
        fetch(`/api/reservation/update/${reservation.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title,
                room,
                start,
                end
            }),
        });

    }

    return (
        <Form method="POST" onChange={handleChange}>
            <input title="title" name="title" type="text" value={title}/>
            <input title="room" name="room" type="text" value={room}/>
            <input title="start" name="start" type="datetime-local" value={start}/>
            <input title="end" name="end" type="datetime-local" value={end}/>
        </Form>
    );
}