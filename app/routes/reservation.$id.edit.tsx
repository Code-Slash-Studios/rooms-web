import { useLoaderData } from "@remix-run/react";
import { FormEventHandler, useEffect, useState } from "react";
import { getById, post } from "~/api/reservation";
import { getRoom } from "~/api/room";
import { Reservation, ReservationFormComp } from "~/components/Reservation";

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
            setRoomID(reservation.roomID);
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
        console.log(title, getRoom(roomID), start, end);
        if (!reservation) {
            console.error("No reservation found");
            return;
        }
        let save = new Reservation(reservation.id, title, roomID, getRoom(roomID), start, end)
        if (save.isValid()) {
            post(save).then((res) => {
                alert(res)
            });
        }
    }

    return (
        <div>
            <h1 key="title">Edit Reservation</h1>
            <ReservationFormComp title={title} roomID={roomID} start={start} end={end} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    );
}