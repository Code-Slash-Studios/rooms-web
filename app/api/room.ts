import fetch from "node-fetch";
import https from "https";
import { Room } from "~/models/room"
// const rooms = [
//     {id: 1, name: "W210", building: "Dupre", title:"W210"},
//     {id: 2, name: "W212", building: "Dupre", title:"W212"},
//     {id: 3, name: "WCC",  building: "Dupre", title:"CIS Conference Room"},
// ]

// use the https agent to disable cert verification for self-signed certs
const httpsAgent = new https.Agent({
    rejectUnauthorized: false}
);

export async function getRooms () {
    const rooms: Room[] = await fetch(
        `${process.env.API_URL!}/rooms`,
        {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            },
            agent: httpsAgent
        },
        ).then((response) => {
            return response.json().then((data:any) => {
                return JSON.parse(data).map((r: any) => Room.factory(r));
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
            headers: {
                'Content-Type': 'application/json'
            },
            agent: httpsAgent
        },
        ).then((response) => {
            return response.json().then((data:any) => {
                return Room.fromJSON(data);
            })
        }
    ).catch((error) => {
        console.error(error); return undefined
    }
    );
    return room
}