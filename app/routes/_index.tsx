import { getRooms } from "~/api/room";
import Rooms from "./rooms";

export async function loader() {
    let rooms = getRooms();
    return {"rooms": rooms};
}

export default function Index() {
    return <Rooms></Rooms>
}