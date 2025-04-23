import { LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getNextReservationByRoomId } from "~/api/reservation";
import { getRooms } from "~/api/room";
import { Room } from "~/models/room";
import { getUser } from "~/services/auth";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getUser(request);
    const roomData = await getRooms();
    let getError: undefined | string = undefined
    if (roomData.length === 0) {
        getError = "No Rooms Found. The API may be down, check back again later."
    }
    return {roomsData: roomData.map((r) => r.toJSON()), getError: getError, user:user};
}

export default function Rooms() {
    const {roomsData, user, getError} = useLoaderData<typeof loader>();
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
    if (getError) {
        return <p>getError</p>
    }
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
                    <h2>Dupre {room.id} - {room.name}</h2>
                    <p>Placeholder for status integration</p>
                    <a href={"schedule/" + room.id + (user? "" : "/general")}><button>Schedule</button></a>
                </div>
            )}
        </section>
        </main>
    );
}