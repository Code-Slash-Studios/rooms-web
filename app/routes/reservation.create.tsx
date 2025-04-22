import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { createReservation } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Reservation } from "~/models/reservation";
import { Form, useLoaderData, useActionData, Link } from "@remix-run/react";
import { Room } from "~/models/room";
import { loginRequired } from "~/services/auth";
import { LoaderFunctionArgs } from "@remix-run/node";
import { toDatetimeLocal } from "~/utils/datetime";

export const action = async ({request}: LoaderFunctionArgs) => {
    const user = await loginRequired(request);
    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const roomID = formData.get("roomID")?.toString() || "";
    const start = new Date(formData.get("start-date") + "T" + formData.get("start-time"));
    const duration: number = parseInt(formData.get("duration")?.toString() || "60");
    const end = new Date(start.getTime() + (duration * 60 * 1000));
    let save = new Reservation(-1, title, roomID, user.id, start, end)
    const isValid = save.isValid();
    if (isValid.valid) {
        return createReservation(save, request).then((res) => {
            return {message: res};
        });
    } else {
        return {message: "Invalid reservation data:" + isValid.message};
    }
}

export const loader = async ({request}: LoaderFunctionArgs) => {
    // try to get form time from query string
    
    const user = await loginRequired(request);
    console.log(user.id, "create reservation loader");
    const roomData = await getRooms();
    const url = new URL(request.url);
    const time = url.searchParams.get("t")?.toString() || null;
    if (time != null) {
        return {roomData: roomData, initDate: new Date(time), getError: undefined};
    }
    return {roomData: roomData, getError: undefined, initDate: new Date()};
}

export default function CreateReservation() {
    //displays a react component that allows the user to edit a reservation
    const {roomData, initDate} = useLoaderData<typeof loader>();
    const response = useActionData<typeof action>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState<string>("-1");
    const [start, setStart] = useState<Date>(new Date(initDate));
    const [end, setEnd] = useState<Date>(new Date(new Date().getTime() + (60 * 1000)));
    const [duration, setDuration] = useState(60); //in minutes

    useEffect(() => {
        if (roomData != undefined) {
            setRooms(
                Room.factory(roomData),
            );
        }
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


    return (
        <main>
            {response !== undefined ? <p className="Error">{response.message}</p> : <></>}
            <h1 key="title">Create Reservation</h1>
            <Form method="post" onChange={handleChange} className="reservationForm" action="">
                <input type="hidden" value={roomID} title="roomID" name="roomID"></input>
                <input title="title" name="title" type="text" defaultValue={title}/>
                <select title="room" name="room" onChange={(e) => {handleSelect(e)}} value={roomID}>
                    <option value={"-1"}>Select a room</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>{room.name} ({room.department})</option>
                    ))}
                </select>
                <input title="start-date" name="start-date" type="date" defaultValue={toDatetimeLocal(start).split("T")[0]}/>
                <input title="start-time" name="start-time" type="time" defaultValue={toDatetimeLocal(start).split("T")[1]}/>
                <input title="duration" name="duration" type="number" max={240} min={15} defaultValue={duration} step={15}/>
                <button type="submit">Submit</button>
            </Form>
        </main>
    );
}