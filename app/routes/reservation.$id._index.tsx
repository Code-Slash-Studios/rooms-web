import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useState } from "react";
import { deleteReservation, getReservationById } from "~/api/reservation";
import { getRoom } from "~/api/room";
import EditDeleteTray from "~/components/editDeleteTray";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { loginRequired } from "~/services/auth";




//this view is just for looking at details about one reservation
//it should have a button to edit the reservation

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    console.log("~~Reservation Detail Loader~~")
    //get the reservation with the id params.id
    const user = await loginRequired(request);
    const res = await getReservationById(params.id || "-1", user);
    if (res == undefined) {
        console.error("No reservation found");
        return {"reservationID": undefined, "getError": "No reservation found", user:user};
    }
    const room = await getRoom(res.roomID);
    if (room == undefined) {
        console.error("Invalid Room");
        return {"reservationID": undefined, "getError": "Invalid Room",user:user};
    }

    return {"reservationID": params.id, "reservationData": res.toJSON(), "roomData": room.toJSON(), user:user};
  };

export default function reservationDetail() {
    const submit = useSubmit()
    const {reservationID, reservationData, roomData, user} = useLoaderData<typeof loader>();
    const [room, setRoom] = useState<Room | undefined>();
    const [reservation, setReservation] = useState<Reservation | undefined>();
    const [error, setError] = useState<string | undefined>();
    //get the reservation with the id reservationID
    useEffect(() => {
        if (reservationData != undefined) {
            const r = Reservation.fromJSON(reservationData);
            setReservation(r);
        }
        if (roomData != undefined) {
            const r = Room.fromJSON(roomData);
            setRoom(r);
        }

    }, [reservationID, reservationData, roomData]);
    //full date and time with hours and minutes (no seconds)
    if (reservation == undefined || room == undefined) {
        return <p>Loading...</p>;
    }
    if (error != undefined) {
        return <p>{error}</p>;
    }
    
    return <main><section><div className="content">
        <h1 key="title">Reservation Details</h1>
        <h2>{reservation.name}</h2>
        {(reservation.userID === user.id || user.isAdmin) && <EditDeleteTray reservation={reservation}></EditDeleteTray>}
        <p>Room: {room.name}</p>
        <p>Title: {reservation.name}</p>
        <p>User: {reservation.userID}</p>
        <p>Start: {reservation.start.toLocaleString()}</p>
        <p>End: {reservation.end.toLocaleString()}</p>
        <p>Department: {room.department}</p>
        </div></section>
    </main>;
}
