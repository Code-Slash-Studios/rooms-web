import { Reservation } from "~/models/reservation";
import { DecodeBody } from "~/utils/responseDecode";

/**
 * "/reservations"      # GET all reservations
 * "/reservations/{id}" # GET reservation by id
 * "/reservations"      # POST create reservation
 * "/reservations/{id}" # PUT update reservation by id
 * "/reservations/{id}" # DELETE delete reservation by id
 * "/reservations/room/{room_id}", # GET reservations by room id, all reservations in a room
 * "/reservations/user/{user_id}" # GET reservations by user id, all reservations made by a user
 */

export async function getAllReservations(request: Request) {
    const reservations: Reservation[] | [] = await fetch(
        `${process.env.API_URL!}/reservations`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
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

export async function getReservationById(id: string, actor?: any): Promise<Reservation | undefined> {
    
    const reservation: Reservation | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${id}`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        }
        ).then((response) => {
            if (response.status === 404 || response.status === 403 || response.ok === false) {
                console.error("Error fetching reservation", response.status, response.statusText)
                throw new Response("Reservation not found", {status: 404});
            }
            return response.json().then((json:any) => {
                return Reservation.fromJSON(json);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    });
    return reservation
}

export async function createReservation(reservation: Reservation, actor?: any) {
    
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

export async function updateReservation(reservation: Reservation, actor?: any): Promise<string | undefined> {
    if (actor !== undefined) {
        if (actor.id !== reservation.userID && !actor.isAdmin) {
            throw new Response(JSON.stringify({error: "permission denied"}),{status: 403})
        }
    }
    const resp: any | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${reservation.id}`,
        {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: reservation.toJSON()
        }
    ).then(async (response) => {
        if (response.status === 400 || response.status === 409 || response.ok === false) {
            console.error("Error updating reservation", response.status, response.statusText)
            throw Error("<Update Error> " + await DecodeBody(response));
        }
        return "Reservation updated successfully: #" + reservation.id + " " + reservation.name;
    }).catch((error) => {
        console.error(error.message);
        return error.message
    });
    return resp
}

export async function deleteReservation(reservation: Reservation, actor?: any) {
    if (actor !== undefined) {
        console.log(actor.id,"is deleting", reservation.userID, actor.isAdmin)
        if (actor.id !== reservation.userID && !actor.isAdmin) {
            return new Response("PermissionDenied",{status: 403})
        }   
    }
    const resp: any | undefined = await fetch(
        `${process.env.API_URL!}/reservations/${reservation.id}`,
        {
            method: "DELETE",
        }
    ).then((response) => {
        return new Response(JSON.stringify({success: true}),{status: 200});
    }).catch((error) => {
        console.error(error); return undefined
    });
    return resp
}

export async function getReservationsByRoomId(room_id: string, actor?: any) {
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

export async function getNextReservationByRoomId(room_id: string, actor?: any) {
    //this path does not exist on the api so return getReservations filtered for next reservation
    return getReservationsByRoomId(room_id, actor).then((reservations) => {
        const now = new Date();
        const nextReservation = reservations.filter((reservation) => {
            return (reservation.start < now && now < reservation.end) || reservation.start > now;
        }
        ).sort((a, b) => {
            return a.start.getTime() - b.start.getTime();
        }
        )[0];
        return nextReservation;
    }).catch((error) => {
        console.error(error); return undefined
    });
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