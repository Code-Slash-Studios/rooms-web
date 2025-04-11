import { getRooms } from "~/api/room";
import Rooms from "./rooms";

export const loader = async () => {
    const roomData = await getRooms();
    console.log(roomData)
    return {roomsData: roomData.map((r) => r.toJSON()), getError: undefined};
}

export default function Index() {
    return <Rooms></Rooms>
}