import { Reservation } from "~/components/Reservation";

export const url = "https://de5349bd-1628-4ca3-b667-05d25816b5e5.mock.pstmn.io"

export async function getAll() {
    return JSON.stringify([
        {
            title: "Event 1",
            room: "W210",
            start: new Date(),
            end: new Date()
        },
        {
            title: "Event 2",
            room: "W212",
            start: new Date(),
            end: new Date()
        }
    ]);
}
export async function getById(id: string) {
    return fetch(
        `https://de5349bd-1628-4ca3-b667-05d25816b5e5.mock.pstmn.io/reservation/1`
        ).then((response) => {
            return response.json().then((json) => {
                return Reservation.fromJSON(json);
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}