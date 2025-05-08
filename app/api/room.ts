import { Room, RoomAndReservations } from "~/models/room"
import { getReservationsByRoomId } from "./reservation";
// const rooms = [
//     {id: 1, name: "W210", building: "Dupre", title:"W210"},
//     {id: 2, name: "W212", building: "Dupre", title:"W212"},
//     {id: 3, name: "WCC",  building: "Dupre", title:"CIS Conference Room"},
// ]

export async function getRoomsAndReservations () {
    const rooms: RoomAndReservations[] = await fetch(
        `${process.env.API_URL!}/rooms`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            
        },
        ).then((response1) => {
            return response1.json().then(async (json:any) => {
                const rooms = Room.factory(json);
                const roomAndRes: RoomAndReservations[] = await Promise.all(rooms.map(async (room: Room) => {
                    const reservations = await getReservationsByRoomId(room.id);
                    return {room: room, reservations: reservations};
                }));
                return roomAndRes;
            })
        }
        ).catch((error) => {
            console.error(error);
            throw error
        }
    );
    return rooms;
}

export async function getRooms () {
    const rooms: Room[] = await fetch(
        `${process.env.API_URL!}/rooms`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            
        },
        ).then((response) => {
            return response.json().then((json:any) => {
                return Room.factory(json);
            })
        }
    ).catch((error) => {
        console.error(error);
        throw error
    });
    return rooms
}

export async function getRoom (id: string) {
    const room: Room | undefined = await fetch(
        `${process.env.API_URL!}/rooms/${id}`,
        {
            method: "GET",
        },
        ).then((response) => {
            return response.json().then((json: any) => {
                return Room.fromJSON(json);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    }
    );
    return room
}