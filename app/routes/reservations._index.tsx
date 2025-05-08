import { deleteReservation, getAllReservations } from '~/api/reservation';
import { Reservation } from '~/models/reservation';
import { Link, redirect, useActionData, useLoaderData, useSubmit } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { loginRequired } from '~/services/auth';
import { ActionFunction, ActionFunctionArgs, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { genDate, genTime, startOfDay } from '~/utils/datetime';
import EditDeleteTray from '~/components/editDeleteTray';

export const action: ActionFunction = async ({request}: ActionFunctionArgs) => {
    const user = await loginRequired(request)
    const data = await request.formData().then(d => d.get("reservation"))
    if (data === null) {
        return {"response": new Response("invalid form data")}
    }
    const r = Reservation.fromJSON(data)
    const resp = await deleteReservation(r, user);
    return redirect(`/schedule/${r.roomID}`)
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

    return <main>
        <h1 key="title">All Reservations</h1>
        <table key="reservations" className='res-table'>
            <thead>
                <tr>
                    <th>Room</th>
                    <th>Title</th>
                    <th>User</th>
                    <th>Start</th>
                    <th>Duration</th>
                    <th></th>
                </tr>
            </thead>
            <tbody key="reservations">
                {reservations.map((r) => 
                    <tr key={r.id}>
                        <td>{r.roomID}</td>
                        <td className='name'>{r.name}</td>
                        <td>{r.userID}</td>
                        <td>{genDate(r.start) + " " + genTime(r.start)}</td>
                        <td>{(r.end.getTime() - r.start.getTime()) / (60 * 1000)} minutes</td>
                        {(r.userID === user.id || user.isAdmin) && <td><EditDeleteTray reservation={r} allowDelete={true}></EditDeleteTray></td>}
                    </tr>
                )}
            </tbody>
        </table>
        {oldReservations.length > 0 && reservations.length > 0 && <h2 key={"title2"}>Archive: (past reservations)</h2>}
        <table key="old-reservations" className='res-table'>
            <thead>
                <tr>
                    <th>Room</th>
                    <th>Title</th>
                    <th>User</th>
                    <th>Start</th>
                    <th>Duration</th>
                    <th></th>
                </tr>
            </thead>
            <tbody key="old-reservations">
                {oldReservations.map((r) => 
                    <tr key={r.id}>
                    <td>{r.roomID}</td>
                    <td className='name'>{r.name}</td>
                    <td>{r.userID}</td>
                    <td>{genDate(r.start) + " " + genTime(r.start)}</td>
                    <td>{(r.end.getTime() - r.start.getTime()) / (60 * 1000)} minutes</td>
                    {(user.isAdmin) && <td><EditDeleteTray reservation={r} allowDelete={true}></EditDeleteTray></td>}
                    </tr>
                )}
            </tbody>
        </table>
        {reservations.length == 0 && <p>No reservations found</p>}
    </main>
}
