import { Reservation } from "~/models/reservation";

/**
 * "/reservations"      # GET all reservations
 * "/reservations/{id}" # GET reservation by id
 * "/reservations"      # POST create reservation
 * "/reservations/{id}" # PUT update reservation by id
 * "/reservations/{id}" # DELETE delete reservation by id
 * "/reservations/room/{room_id}", # GET reservations by room id, all reservations in a room
 * "/reservations/user/{user_id}" # GET reservations by user id, all reservations made by a user
 */

export async function getAllReservations() {
    const reservations: Reservation[] | [] = await fetch(
        `${process.env.apiURL!}/reservations`,
        ).then((response) => {
            return response.json().then((json) => {
                return json.map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}

export async function getReservationById(id: string) {
    const reservation: Reservation | undefined = await fetch(
        `${process.env.apiURL!}/reservations/${id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return Reservation.factory(json);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    });
    return reservation
}

export async function createReservation(reservation: Reservation) {
    const resp: JSON | undefined = await fetch(
        `${process.env.apiURL!}/reservations`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {
        console.error(error); return undefined
    });
    return resp
}

export async function updateReservation(reservation: Reservation) {
    const resp: JSON | undefined = await fetch(
        `${process.env.apiURL!}/reservations/${reservation.id}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservation)
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {
        console.error(error); return undefined
    });
    return resp
}

export async function deleteReservation(id: string) {
    const resp: JSON | undefined = await fetch(
        `${process.env.apiURL!}/reservations/${id}`,
        {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json'
            }
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {
        console.error(error); return undefined
    });
    return resp
}

export async function getReservationsByRoomId(room_id: string) {
    const reservations: Reservation[] | [] = await fetch(
        `${process.env.apiURL!}/reservations/room/${room_id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return json.map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}

export async function getReservationsByUserId(user_id: string) {
    const reservations: Reservation[] | [] = await fetch(
        `${process.env.apiURL!}/reservations/user/${user_id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return json.map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}