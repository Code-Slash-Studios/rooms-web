import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getReservationsByUserId } from "~/api/reservation";
import { Reservation } from "~/models/reservation";
import { loginRequired } from "~/services/auth";

// Mock function to fetch reservations (replace with actual implementation)

export const loader: LoaderFunction = async ({ request }) => {
    // get user from cookie or show 403
    const user = await loginRequired(request);
    const reservations = await getReservationsByUserId(user.id);
    return {user, reservationData: reservations.map((reservation) => reservation.toJSON())};
};

export default function Profile() {
    const { reservationData } = useLoaderData<typeof loader>();
    const [reservations, setReservations] = useState<Reservation[]>([]);

    useEffect(() => {
        if (reservationData) {
            const res = Reservation.factory(reservationData);
            setReservations(res);
        }
    }, [reservationData]);

    return (
        <div>
            <h1>User Reservations</h1>
            <ul>
                {reservations.map((reservation) => (
                    reservation.render()
                ))}
            </ul>
        </div>
    );
}