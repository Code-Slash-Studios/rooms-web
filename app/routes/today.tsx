import { getAll } from '~/api/reservation';
import { Reservation } from '~/components/Reservation';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ params }:any) => {
    return getAll().then((res) => {
        if (res == undefined) {
            console.error("No reservations found");
            return {"reservations": undefined, "getError": "No reservations found"};
        }
        return {"reservations": res, "getError": undefined};
    });
};

export default function Today() {
    const {reservations, getError} = useLoaderData<typeof loader>();

    const time = new Date();
    const time2 = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours() + 2, time.getMinutes(), time.getSeconds());
    return <>
        <h1 key="title">Welcome to Today! {time.toLocaleDateString("en-US", {month: "long", day:"numeric"})}</h1>
        {getError && <p key="error">{getError}</p>}
        <ul key="reservations">
            {reservations != undefined && reservations.map((r: Reservation) => r.render())}
        </ul>
    </>
}
