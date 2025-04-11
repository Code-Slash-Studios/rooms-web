import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getRooms } from "~/api/room";
import { Room } from "~/models/room";

export const loader = async function() {
    //get rooms from the api
    const roomsData = await getRooms();
    return {"roomsData": roomsData};
}

export default function Rooms() {
    const {roomsData} = useLoaderData<typeof loader>();
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => {
        // set rooms data to the state
        if (roomsData != undefined) {
            setRooms(
                Room.factory(roomsData),
            );
        }
    }
    , [roomsData]);

    return (
        <section className="rooms">
            {rooms.map((room) =>
                <div className="room" key={room.id}>
                    <h2>Dupre - {room.name}</h2>
                    <p>Placeholder for status integration</p>
                    <a href={"schedule/" + room.name}><button>Schedule</button></a>
                </div>
            )}
        </section>
    );
}