import { Reservation } from "~/models/reservation";
// disable https cert warning as we are using a self-signed cert in development

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
        `${process.env.API_URL!}/reservations`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then((response) => {
            return response.json().then((data:any) => {
                return JSON.parse(data).map((r: any) => Reservation.factory(r));
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}

export async function getReservationById(id: string): Promise<Reservation | undefined> {
    const reservation: Reservation | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${id}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then((response) => {
            return response.json().then((data:any) => {
                return Reservation.fromJSON(data);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    });
    return reservation
}

export async function createReservation(reservation: Reservation) {
    const resp: any | undefined = await fetch(
        `${process.env.API_URL!}/reservations`,
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: reservation.toJSON()
        }
    ).then((response) => {
        return response.json();
    }).catch((error) => {
        console.error(error); return undefined
    });
    return resp
}

export async function updateReservation(reservation: Reservation) {
    const resp: any | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${reservation.id}`,
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
    const resp: any | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${id}`,
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
        `${process.env.API_URL!}/reservations/room/${room_id}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
        }
        ).then((response) => {
            return response.json().then((json:any) => {
                return Reservation.factory(json);
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}

export async function getReservationsByUserId(user_id: string) {
    const reservations: Reservation[] | [] = await fetch(
        `${process.env.API_URL!}/reservations/user/${user_id}`,
        ).then((response) => {
            return response.json().then((json:any) => {
                return Reservation.factory(json);
            })
        }
    ).catch((error) => {
        console.error(error); return []
    });
    return reservations
}