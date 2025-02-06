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
    if (timeOnly) {
        //time with hours and minutes (no seconds)
        var start = props.start.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
        var end = props.end.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
    } else {
        //full date and time with hours and minutes (no seconds)
        var start = props.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
        var end = props.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
    }
    return <div className="event" key="{props.title}">
        <h1 key="title1">Reservation Detail</h1>
        <h1 key="title"><u>{props.title}</u> in {props.room}</h1>
        <h2 key="time">{start} - {end}</h2>
    </div>
}
