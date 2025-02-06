import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getById } from "~/api/reservation";
import { Reservation } from "~/components/Reservation";

//this view is just for looking at details about one reservation
//it should have a button to edit the reservation

export const loader = async ({ params }:any) => {
    return {"reservationID": params.id};
  };

export default function reservationDetail() {
    const {reservationID} = useLoaderData<typeof loader>();
    const [reservation, setReservation] = useState<Reservation>(Reservation.empty());
    const [error, setError] = useState<string | undefined>();
    //get the reservation with the id reservationID
    useEffect(() => {
        getById(reservationID).then((res) => {
            if (res == undefined) {
                setError("No reservation found");
                console.error("No reservation found");
                return;
            }
            console.log(res)
            setReservation(res);
        });

    }, [reservationID]);


    return <div>
        <h1 key="title">Reservation Detail</h1>
        {error && <p>{error}</p>}
        <div key="content">
            <p>{reservation.render()}</p>
        </div>
    </div>
}