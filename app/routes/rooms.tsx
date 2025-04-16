import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getNextReservationByRoomId } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Room } from "~/models/room";

export const loader = async () => {
    const roomData = await getRooms();
    console.log(roomData)
    return {roomsData: roomData.map((r) => r.toJSON()), getError: undefined};
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
    if (roomsData == undefined) {
        return <p>Loading...</p>;
    }
    if (rooms.length == 0) {
        return <p>Loading... No rooms found yet...</p>;
    }
    return (
        <main>
        <section className="rooms">
            {rooms.map((room) =>
                <div className="room" key={room.id}>
                    <h2>Dupre - {room.name}</h2>
                    <p>Placeholder for status integration</p>
                    <a href={"schedule/" + room.id}><button>Schedule</button></a>
                </div>
            )}
        </section>
        </main>
    );
}