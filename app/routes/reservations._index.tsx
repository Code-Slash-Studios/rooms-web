import { deleteReservation, getAllReservations } from '~/api/reservation';
import { Reservation } from '~/models/reservation';
import { Link, redirect, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { loginRequired } from '~/services/auth';
import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { startOfDay } from '~/utils/datetime';

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
    const user = await loginRequired(request)
    const data = await request.formData().then(d => d.get("reservation"))
    console.log(data)
    if (data === null) {
        return {"response": new Response("invalid form data")}
    }
    const r = Reservation.fromJSON(data)
    const resp = await deleteReservation(r, user);
    console.log(resp)
    return {"response": resp}
}

export const loader: LoaderFunction = async ({request}: LoaderFunctionArgs) => {
    const user = await loginRequired(request);
    return getAllReservations(request).then((res) => {
        if (res == undefined) {
            console.error("No reservations found");
            return {"getError": "No reservations found", "user": user};
        }
        if (res.length == 0) {
            console.error("No reservations found");
            return {"getError": "No reservations found", "user": user};
        }
        return {"reservationData": res.map((r) => r.toJSON()), "user": user};
    });
};

export default function ReservationIndex() {
    const submit = useSubmit()
    //const {response} = useActionData<typeof action>();
    const {reservationData, getError, user} = useLoaderData<typeof loader>();
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [oldReservations, setOldReservations] = useState<Reservation[]>([]);

    const DAY_START = startOfDay()

    useEffect(() => {
        console.log("Reservation Data", reservationData);
        if (reservationData != undefined) {
            const rs = Reservation.factory(reservationData)
            setReservations(
                rs.filter((r)=>r.start >= DAY_START)
            );
            setOldReservations(
                rs.filter((r)=>r.start < DAY_START)
            )
        }
    }, [reservationData]);
    
    if (reservations == undefined && getError == undefined) {
        return <p>Loading...</p>;
    }
    if (getError != undefined) {
        //TODO Generic Error Pages
        return <p>{getError}</p>;
    }

    const handleDelete = (r: Reservation) => {
        let cnf = confirm(`Are you sure you want to delete the ${r.name} reservation?`)
        console.log(cnf)
        if (cnf)
            submit({reservation: r.toJSON()}, {"encType":"multipart/form-data", method:"POST", action:""})
    }

    return <>
        <h1 key="title">All Reservations</h1>
        <ul key="reservations">
            {reservations.map((r) => 
                <li key={r.id}>
                    <h2>{r.name}</h2>
                    {(r.userID === user.id || user.isAdmin) && <span className='button-tray'><Link to={`/reservation/${r.id}/edit`}><button className='edit'>&#9998;</button></Link><button className='delete' type='button' onClick={(e)=>handleDelete(r)}>Delete</button></span>}
                    <p>Room: {r.roomID}</p>
                    <p>User: {r.userID}</p>
                    <p>Start: {r.start.toLocaleString()}</p>
                    <p>End: {r.end.toLocaleString()}</p>
                    <p>Duration: {(r.end.getTime() - r.start.getTime()) / (60 * 1000)} minutes</p>
                </li>
            )}
        </ul>
        {oldReservations.length > 0 && reservations.length > 0 && <h2>Archive:</h2>}
        <ul key="archive archive-reservations reservations">
            {oldReservations.map((r) => 
                <li key={r.id}>
                    <h2>{r.name}</h2>
                    {(r.userID === user.id || user.isAdmin) && <span className='button-tray'><Link to={`/reservation/${r.id}/edit`}><button className='edit'>&#9998;</button></Link><button className='delete' type='button' onClick={(e)=>handleDelete(r)}>Delete</button></span>}
                    <p>Room: {r.roomID}</p>
                    <p>User: {r.userID}</p>
                    <p>Start: {r.start.toLocaleString()}</p>
                    <p>End: {r.end.toLocaleString()}</p>
                    <p>Duration: {(r.end.getTime() - r.start.getTime()) / (60 * 1000)} minutes</p>
                </li>
            )}
        </ul>
    </>
}
