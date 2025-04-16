import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { getReservationById, updateReservation } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { LoaderFunctionArgs } from "@remix-run/node";
import { toDatetimeLocal } from "~/utils/datetime";

export const action = async ({request}: LoaderFunctionArgs) => {
    //TODO once user is available, use userID instead of hardcoded "caldweln"
    const formData = await request.formData();
    const id: number = Number.parseInt(formData.get("id")?.toString() || "-1");
    const title = formData.get("title")?.toString() || "";
    const roomID = formData.get("room")?.toString() || "";
    const start = new Date(formData.get("start-date") + "T" + formData.get("start-time"));
    const duration: number = parseInt(formData.get("duration")?.toString() || "60");
    const end = new Date(start.getTime() + (duration * 60 * 1000));
    let save = new Reservation(id, title, roomID, "caldweln", start, end)
    const isValid = save.isValid();
    if (isValid.valid && id !== -1) {
        return updateReservation(save).then((res) => {
            return res;
        });
    } else {
        if (id == -1) {
            return "Invalid reservation data: ID is -1, form data tampered with?";
        }
        return "Invalid reservation data:" + isValid.message;
    }
}

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
    const response = useActionData<typeof action>();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [id, setId] = useState(-1);
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
            setId(r.id);
            setTitle(r.name);
            setRoomID(r.roomID);
            setStart(r.start);
            setEnd(r.end);
            setDuration((r.end.getTime() - r.start.getTime()) / (60 * 1000));
        }
    }, [reservationData, roomsData]);

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

    return (
        <div>
            <h1 key="title">Edit Reservation</h1>
            <main>
            {response != undefined ? <p className="Error">{response.id}</p> : <></>}
            <h1 key="title">Create Reservation</h1>
            <Form method="put" onChange={handleChange} className="reservationForm" onSubmit={(e) => {console.log(roomID)}}>
                <input type="hidden" name="id" value={id}/>
                <input title="title" name="title" type="text" defaultValue={title}/>
                <select title="room" name="room" onChange={(e) => {handleSelect(e)}}>
                    <option value={-1}>Select a room</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id} selected={roomID === room.id}>{room.name} ({room.department})</option>
                    ))}
                </select>
                <input title="start-date" name="start-date" type="date" defaultValue={toDatetimeLocal(start).split("T")[0]}/>
                <input title="start-time" name="start-time" type="time" defaultValue={toDatetimeLocal(start).split("T")[1]}/>
                <input title="duration" name="duration" type="number" max={240} min={15} defaultValue={duration}/>
                <button type="submit">Submit</button>
            </Form>
        </main>
        </div>
    );
}