import { Room } from "~/models/room"
// const rooms = [
//     {id: 1, name: "W210", building: "Dupre", title:"W210"},
//     {id: 2, name: "W212", building: "Dupre", title:"W212"},
//     {id: 3, name: "WCC",  building: "Dupre", title:"CIS Conference Room"},
// ]

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
                return json.map((r: any) => Room.factory(r));
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