import { useLoaderData } from "@remix-run/react";
import { getRooms } from "~/api/room";

export const loader = function() {
    //get rooms from the api
    let rooms = getRooms();
    return {"rooms": rooms};
}

export default function Rooms() {
    const {rooms} = useLoaderData<typeof loader>();
    return (
        <section className="rooms">
            {rooms.map((room) =>
                <div className="room" key={room.id}>
                    <h2>Dupre - {room.title}</h2>
                    <p>Placeholder for status integration</p>
                    <a href={"schedule/" + room.name}><button>Schedule</button></a>
                </div>
            )}
        </section>
    );
}