import { Reservation } from "~/components/Reservation";
import { url } from "./get";

export async function post(reservation: Reservation) {
    return fetch(
        `${url}/reservation`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {console.error(error); return undefined});
}