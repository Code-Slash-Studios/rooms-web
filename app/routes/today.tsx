import { getAll } from '~/api/reservation';
import { Reservation } from '~/models/reservation';
import { useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';

export const loader = async ({ params }:any) => {
    return getAll().then((res) => {
        if (res == undefined) {
            console.error("No reservations found");
            return {"reservations": undefined, "getError": "No reservations found"};
        }
        return {"reservationData": res, "getError": undefined};
    });
};

export default function Today() {
    const {reservationData, getError} = useLoaderData<typeof loader>();

    const [reservations, setReservations] = useState<Reservation[] | undefined>(undefined);

    const time = new Date();

    useEffect(() => {
        setReservations(Reservation.factory(reservationData));
    }, [reservationData]);
    return <>
        <h1 key="title">Welcome to Today! {time.toLocaleDateString("en-US", {month: "long", day:"numeric"})}</h1>
        {getError && <p key="error">{getError}</p>}
        <ul key="reservations">
            {reservations != undefined && reservations.map((r) => r.render())}
        </ul>
    </>
}
