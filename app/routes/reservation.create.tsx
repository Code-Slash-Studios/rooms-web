import { Form, useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { post } from "~/api/reservation";
import { getRoom, getRooms } from "~/api/room";
import { Reservation, ReservationFormComp } from "~/components/Reservation";
import { toDatetimeLocal } from "~/utils/datetime";

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState(-1);
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());

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
        console.log(title, getRoom(roomID), start, end);
        let save = new Reservation(-1, title, roomID, getRoom(roomID), start, end)
        if (save.isValid()) {
            post(save).then((res) => {
                alert(res)
            });
        }

    }

    return (
        <div>
            <h1 key="title">Create Reservation</h1>
            <ReservationFormComp title={title} roomID={roomID} start={start} end={end} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    );
}