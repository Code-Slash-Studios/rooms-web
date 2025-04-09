import { Reservation } from "~/models/reservation";

export async function getAll(): Promise<Reservation[] | undefined> {
    return fetch(
        `${process.env.apiURL!}/reservations`,
        ).then((response) => {
            return response.json().then((json) => {
                return json.map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}

export async function getById(id: string) {
    return fetch(
        `${process.env.apiURL!}/reservation/${id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return Reservation.factory(json);
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}

export async function post(reservation: Reservation) {
    return fetch(
        `${process.env.apiURL!}/reservation`,
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