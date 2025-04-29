import { redirect } from "@remix-run/react";
import { SessionUser } from "~/models/auth";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { genTime } from "~/utils/datetime";
import "./RoomStatus.css";

interface RoomStatusProps {
    index: number;
    room: Room;
    reservations: Reservation[];
    user?: SessionUser
}


export const RoomStatus = ({index, room, reservations, user}: RoomStatusProps) => {
    const nextReservation = Reservation.getNext(reservations);
    const isNow = nextReservation?.isNow() || false;
    const onClick = (e: any) => {
        e.stopPropagation();
        if (user) {
            return redirect(`/rooms/${room.id}`, {
                headers: {
                    "Set-Cookie": `redirect=/rooms/${room.id}`,
                },
            });
        } else {
            return redirect("/login", {
                headers: {
                    "Set-Cookie": `redirect=/rooms/${room.id}`,
                },
            });
        }
    }
    return (
        <a className="room-status-container" key={room.id} onClickCapture={(e) => onClick(e)} href={`/schedule/${room.id}/general`}>
            <hr key={"hr1"}></hr>
            <div className="room-status">
                <div className="room-status-info" key={"room-info"}>
                <h2 key={"header"} className="status-title">{room.id} - {room.name}</h2>
                {isNow ? (
                        <h1 key={"status"} className={"closed"}>IN-USE</h1>
                ) : (
                        <h1 key={"status"} className="open">OPEN</h1>
                )}
                {nextReservation ? (
                    <div className="next-reservation">
                        <p key={"next"}><u>Next Event</u>: {genTime(nextReservation.start)}</p>
                    </div>
                ) : (
                    <div className="next-reservation">
                        <p key={"next"}>No Events Scheduled</p>
                    </div>
                )}
                </div>
                <div className="next-info" onClick={onClick} key={"next-info"}>
                    {/* displays info of next reservation */}
                    {nextReservation ? (
                        <div className="next-reservation-info">
                            <h4 key={"name"}><u>{nextReservation.name}</u></h4>
                            <p key={"time"}>{genTime(nextReservation.start)} - {genTime(nextReservation.end)}</p>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
            </div>
            <hr key={"hr2"}></hr>
        </a>
    );
}