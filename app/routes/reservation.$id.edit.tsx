import { ClientLoaderFunctionArgs, Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { ChangeEventHandler, FormEventHandler, useEffect, useState } from "react";
import { getReservationById, updateReservation } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { LoaderFunctionArgs } from "@remix-run/node";
import { toDateISO, toTimeISO } from "~/utils/datetime";
import { loginRequired } from "~/services/auth";

export const action = async ({request}: LoaderFunctionArgs) => {
    const user = await loginRequired(request);
    if (user === undefined) {
        throw new Response("User not logged in", {status: 401});
    }
    const formData = await request.formData();
    const userID: string = formData.get("userID")?.toString() || "-1";
    
    if (userID !== user.id && !user.isAdmin) {
        throw new Response("You do not have permission to edit this reservation", {status: 403});
    }
    const id: number = Number.parseInt(formData.get("id")?.toString() || "-1");
    const title = formData.get("title")?.toString() || "";
    const roomID = formData.get("room")?.toString() || "";
    const start = new Date(formData.get("start-date") + "T" + formData.get("start-time"));
    const duration: number = parseInt(formData.get("duration")?.toString() || "60");
    const end = new Date(start.getTime() + (duration * 60 * 1000));
    let save = new Reservation(id, title, roomID, user.id, start, end)
    const isValid = save.isValid();
    if (isValid.valid && id !== -1) {
        return updateReservation(save, user).then((res) => {
            return {message: res};
        });
    } else {
        return {message: "Update Failed:" + isValid.message};
    }
}

export const loader = async ({ params, request }: ClientLoaderFunctionArgs) => {
    const id = params.id;
    if (id === undefined) {
        throw new Response("Reservation ID not found", {status: 404});
    }
    const user = await loginRequired(request);
    const rooms = await getRooms()
    const data = await getReservationById(id, user).then((res) => {
        if (res === undefined) {
            throw new Response("Reservation not found", {status: 404});
        }
        if (res.userID !== user.id && !user.isAdmin) {
            throw new Response("You do not have permission to edit this reservation", {status: 403});
        }
        return {"reservationData": res.toJSON(), "getError": undefined, "roomsData": rooms.map((r) => r.toJSON()), "userData": user};
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
    const {reservationData, getError, roomsData, userData} = useLoaderData<typeof loader>();
    const response = useActionData<typeof action>();
    const submit = useSubmit();
    const [rooms, setRooms] = useState<Room[]>([]);
    const [id, setId] = useState(-1);
    const [userID, setUserID] = useState(userData.id);
    const [title, setTitle] = useState("");
    const [roomID, setRoomID] = useState("");
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [start, setStart] = useState(new Date());
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
            setUserID(r.userID);
            setRoomID(r.roomID);
            setStart(r.start);
            setHours(r.start.getHours());
            setMinutes(r.start.getMinutes());
            setDuration((r.end.getTime() - r.start.getTime()) / (60 * 1000));
        }
    }, [reservationData, roomsData]);

    const handleChange: FormEventHandler<HTMLFormElement> = (event: any) => {
        const val = event.target.value;
        let new_start: Date = new Date(start.getTime());
        switch(event.target.title) {
            case "title":
                setTitle(val);
                break;
            case "room":
                setRoomID(val);
                break;
            case "start-date":
                new_start = new Date(val.split("-")[0], val.split("-")[1], val.split("-")[2], start.getHours(), start.getMinutes());
                setStart(new_start);
                break;
            case "start-time":
                new_start = new Date(start.getFullYear(), start.getMonth(), start.getDate(), event.target.value.split(":")[0], event.target.value.split(":")[1]);
                setStart(new_start);
                break;
            case "duration":
                if (parseInt(val) < 15) {
                    return;
                }
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
        const formData = new FormData(event.currentTarget);
        formData.append("id", id.toString());
        formData.append("userID", userID.toString());
        submit(formData, {method: "PUT"});
    }

    return (
            <main>
            {response != undefined ? <p key="responseSpace">{response.message}</p> : <></>}
            <h1 key="title">Edit Reservation</h1>
            <Form method="put" onChange={handleChange} className="reservationForm" onSubmit={handleSubmit}>
                <input title="title" name="title" type="text" defaultValue={title} maxLength={30}/>
                <select title="room" name="room" onChange={(e) => {handleSelect(e)}} value={roomID}>
                    <option value={-1}>Select a room</option>
                    {rooms.map((room) => (
                        <option key={room.id} value={room.id}>{room.name} ({room.department})</option>
                    ))}
                </select>
                <input title="start-date" name="start-date" type="date" defaultValue={toDateISO(start)}/>
                <input title="start-time" name="start-time" type="time" defaultValue={toTimeISO(start)}/>
                <input title="duration" name="duration" type="number" max={240} min={15} defaultValue={duration} step={15}/>
                <button type="submit">Submit</button>
            </Form>
        </main>
    );
}