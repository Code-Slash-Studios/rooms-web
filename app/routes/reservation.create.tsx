import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";

import { createReservation } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Reservation } from "~/models/reservation";
import { ReservationFormComp } from "~/components/Reservation";
import { useLoaderData } from "@remix-run/react";
import { Room } from "~/models/room";
import { loginRequired } from "~/services/auth";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await loginRequired(request);
    console.log(user);
    const roomData = await getRooms();

    return {roomData, user};
}

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const {roomData, user} = useLoaderData<typeof loader>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState<string>("0");
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date(new Date().getTime() + (60 * 1000)));
    const [duration, setDuration] = useState(60); //in minutes

    useEffect(() => {
        setRooms(
            roomData.map((r: any) => {
                return new Room(r.id, r.name, r.building);
            }),
        );
    }, [roomData]);

    const handleSelect: ChangeEventHandler<HTMLSelectElement> = (event: any) => {
        setRoomID(event.target.value);
    }
    const handleChange: FormEventHandler<HTMLFormElement> = (event: any) => {
        const val = event.target.value;
        let new_start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), start.getHours(), start.getMinutes());
        switch(event.target.title) {
            case "title":
                setTitle(val);
                break;
            case "room":
                setRoomID(val);
                break;
            case "start-date":
                new_start = new Date(val.split("-")[0], val.split("-")[1], val.split("-")[2], start.getHours(), start.getMinutes());
                setEnd(new Date(new_start.getTime() + (duration * 60 * 1000)));
                setStart(new_start);
                break;
            case "start-time":
                new_start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), event.target.value.split(":")[0], event.target.value.split(":")[1]);
                setEnd(new Date(new_start.getTime() + (duration * 60 * 1000)));
                setStart(new_start);
                break;
            case "duration":
                if (parseInt(val) < 15) {
                    alert("Duration must be at least 15 minutes");
                    return;
                }
                setEnd(new Date(start.getTime() + (parseInt(val) * 60 * 1000)));
                setDuration(parseInt(val));
                break;
            default:
                break;
        }
    }
    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any) => {
        event.preventDefault();
        console.log(title, roomData, start, end);
        let save = new Reservation(-1, title, roomID, user?.user_id || "tempUserID", start, end)
        if (save.isValid()) {
            createReservation(save).then((res) => {
                alert(res)
            });
        }

    }
    return (
        <div>
            <h1 key="title">Create Reservation</h1>
            <ReservationFormComp rooms={rooms} title={title} roomID={roomID} start={start} end={end} duration={duration} onSelect={handleSelect} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    );
}