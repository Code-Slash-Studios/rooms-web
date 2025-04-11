import { useLoaderData } from "@remix-run/react";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { getReservationById, createReservation } from "~/api/reservation";
import { getRoom, getRooms } from "~/api/room";
import { Reservation } from "~/models/reservation";
import { ReservationFormComp } from "~/components/Reservation";
import { Room } from "~/models/room";

export const loader = async ({ params }:any) => {
    const rooms = await getRooms()
    let data = await getReservationById(params.id).then((res) => {
        if (res == undefined) {
            console.error("No reservation found");
            return {"reservationData": undefined, "getError": "No reservation found", "roomsData": rooms.map((r) => r.toJSON())};
        }
        return {"reservationData": res.toJSON(), "getError": undefined, "roomsData": rooms.map((r) => r.toJSON())};
    });
    //Side note, the above code is a bit absurd.
    //Reservation is returned from Fetch as a JSON object, it is then converted into a Reservation in /api/reservation.ts
    //and then converted back into JSON string to be sent to the client from this Loader function.
    //Then it is converted back into a Reservation in the EditReservation component.
    // One plus of this absurity is that we can catch errors serverside. 
    return data;
};

export default function EditReservation() {
    //displays a react component that allows the user to edit a reservation
    const {reservationData, getError, roomsData} = useLoaderData<typeof loader>();
    
    const [reservation, setReservation] = useState<Reservation>(Reservation.empty());
    const [rooms, setRooms] = useState<Room[]>([]);
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState("");
    const [start, setStart] = useState<Date>(new Date());
    const [end, setEnd] = useState<Date>(new Date());
    const [duration, setDuration] = useState(60); //in minutes

    useEffect(() => {
        if (roomsData != undefined) {
            setRooms(
                Room.factory(roomsData),
            );
        }
        if (reservationData != undefined) {
            const r = Reservation.fromJSON(reservationData);
            setReservation(r);
            setTitle(r.name);
            setRoomID(r.roomID);
            setStart(r.start);
            setEnd(r.end);
            setDuration((r.end.getTime() - r.start.getTime()) / (60 * 1000));
        }
    }, [reservationData, roomID, rooms]);

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
    const handleSelect: ChangeEventHandler<HTMLSelectElement> = (event: any) => {
        setRoomID(event.target.value);
    }

    const handleSubmit: FormEventHandler<HTMLFormElement> = (event: any) => {
        event.preventDefault();
        console.log(title, rooms.find((r) => r.id === roomID), start, end);
        if (!reservationData) {
            console.error("No reservation found");
            return;
        }
        let save = new Reservation(reservation.id, title, roomID, "caldweln", start, end)
        if (save.isValid()) {
            createReservation(save).then((res) => {
                alert(res)
            });
        }
    }

    return (
        <div>
            <h1 key="title">Edit Reservation</h1>
            <ReservationFormComp rooms={rooms} title={title} roomID={roomID} start={start} end={end} duration={duration} onSelect={handleSelect} onChange={handleChange} onSubmit={handleSubmit} />
        </div>
    );
}