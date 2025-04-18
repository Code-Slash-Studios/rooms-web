import { getRooms } from "~/api/room";
import Rooms, {loader as RoomLoader} from "./rooms";

export const loader = RoomLoader;

export default function Index() {
    return <Rooms></Rooms>
}