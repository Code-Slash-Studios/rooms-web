import { LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getNextReservationByRoomId } from "~/api/reservation";
import { getRooms, getRoomsAndReservations } from "~/api/room";
import { RoomStatus } from "~/components/RoomStatus";
import { SessionUser, SessionUserFromJSON } from "~/models/auth";
import { Reservation } from "~/models/reservation";
import { Room, RoomAndReservations } from "~/models/room";
import { getRequestUser } from "~/services/auth";

export const loader = async ({request}: LoaderFunctionArgs) => {
    const user = await getRequestUser(request);
    const roomAndResData = await getRoomsAndReservations();
    let getError: undefined | string = undefined
    if (roomAndResData.length === 0) {
        getError = "No Rooms Found. The API may be down, check back again later."
    }
    return {roomsData: roomAndResData, getError: getError, userData:user};
    //return {roomsData: roomAndResData.map((rnr) => {return {"room": rnr.room.toJSON(), "reservations": rnr.reservations.map((r)=> r.toJSON())}}), getError: getError, user:user};
}

export default function Rooms() {
    const {roomsData, userData, getError} = useLoaderData<typeof loader>();
    const [rooms, setRooms] = useState<RoomAndReservations[]>([]);
    const [user, setUser] = useState<SessionUser | undefined>(undefined);
    useEffect(() => {
        // set rooms data to the state
        setRooms(roomsData.map((data: any) => {
            data.room = Room.fromJSON(data.room);
            data.reservations = Reservation.factory(data.reservations);
            return data;
        }));
        if (userData) {
            console.log(userData)
            setUser(SessionUserFromJSON(userData));
        }
    }
    , [roomsData, userData]);
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
            {rooms.map(({room, reservations}, index, array) =>
                <RoomStatus index={array.length-index} room={room} reservations={reservations} user={user}/>
            )}
        </section>
        </main>
    );
}