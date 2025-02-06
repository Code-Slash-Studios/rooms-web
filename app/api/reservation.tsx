import { Reservation } from "~/components/Reservation";

export const url = "https://de5349bd-1628-4ca3-b667-05d25816b5e5.mock.pstmn.io"

export async function getAll(): Promise<Reservation[] | undefined> {
    return fetch(
        `${url}/reservations`,
        ).then((response) => {
            return response.json().then((json) => {
                return json.map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}

export async function getById(id: string) {
    return fetch(
        `${url}/reservation/${id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return Reservation.factory(json);
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}

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