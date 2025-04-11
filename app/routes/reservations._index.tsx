import { getAllReservations } from '~/api/reservation';
import { Reservation } from '~/models/reservation';
import { ClientLoaderFunctionArgs, useLoaderData } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { loginRequired } from '~/services/auth';

export const loader = async ({request}: ClientLoaderFunctionArgs) => {
    return getAllReservations().then((res) => {
        if (res == undefined) {
            console.error("No reservations found");
            return {"reservations": undefined, "getError": "No reservations found"};
        }
        if (res.length == 0) {
            console.error("No reservations found");
            return {"reservations": undefined, "getError": "No reservations found"};
        }
        console.log(res);
        return {"reservationData": res, "getError": undefined};
    });
};

export default function ReservationIndex() {
    const {reservationData, getError} = useLoaderData<typeof loader>();

    const [reservations, setReservations] = useState<Reservation[] | undefined>(undefined);

    const time = new Date();

    useEffect(() => {
        if (reservationData != undefined) {
            setReservations(
                reservationData
            );
        }
    }, [reservationData]);
    
    if (reservations == undefined && getError == undefined) {
        return <p>Loading...</p>;
    }
    if (getError != undefined) {
        //TODO Generic Error Pages
        return <p>{getError}</p>;
    }

    return <>
        <h1 key="title">All Reservations</h1>
        <ul key="reservations">
            {reservations != undefined && reservations.map((r) => r.render())}
        </ul>
    </>
}
