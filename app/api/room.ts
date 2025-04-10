import { Room } from "~/models/room"
// const rooms = [
//     {id: 1, name: "W210", building: "Dupre", title:"W210"},
//     {id: 2, name: "W212", building: "Dupre", title:"W212"},
//     {id: 3, name: "WCC",  building: "Dupre", title:"CIS Conference Room"},
// ]

export async function getRooms () {
    const rooms: Room[] = await fetch(
        `${process.env.API_URL!}/rooms`,
        ).then((response) => {
            console.log(response)
            return response.json().then((json) => {
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
        ).then((response) => {
            return response.json().then((json) => {
                return Room.fromJSON(json);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    });
    return room
}