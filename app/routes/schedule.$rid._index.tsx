import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getReservationsByRoomId } from "~/api/reservation";
import { getRoom } from "~/api/room";
import { loginRequired } from "~/services/auth";
import { sessionStorage } from "~/services/session";


export const loader = async ({ params, request }: ClientLoaderFunctionArgs) => {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user"); 
    console.log(user)
    const roomID = params.rid
    if (!roomID) {
        throw new Response("Room ID not found", {status: 404});
    }
    const reservations = await getReservationsByRoomId(roomID);
    const room = await getRoom(roomID);
    if (!room) {
        throw new Response("Room not found", {status: 404});
    }
    return {"room": room, "user": user, "reservations": reservations};
  };

const MILLIS_IN_DAY = 86400000;

export default function ScheduleRoom() {
    const {room, reservations} = useLoaderData<typeof loader>();
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [startOfWeek, setWeekStart] = useState(new Date(selectedDate.getTime() - selectedDate.getDay() * MILLIS_IN_DAY));
    let currentWeek = Array.from({length: 7}, (v, i) => {
        const date = new Date(startOfWeek.getTime() + i * MILLIS_IN_DAY);
        return {"past":date.getTime() < currentDate.getTime(),"date":date}
    });
    let endOfWeek = new Date(startOfWeek.getTime() + 6 * MILLIS_IN_DAY);
    const inThePast = endOfWeek < currentDate;
    const isEndOfMonth = startOfWeek.getMonth() != endOfWeek.getMonth();
    const isEndOfYear = startOfWeek.getFullYear() != endOfWeek.getFullYear();

    const selectDate = (date: Date) => {
        setSelectedDate(date);
    }

    const backWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() - 7 * MILLIS_IN_DAY));
    }
    const nextWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() + 7 * MILLIS_IN_DAY));
    }

    if (!room || room === undefined) {
        console.log(room)
        return <main><div>Room not found</div></main>
    }
    return <main>
        <h2>{room.department} - {room.name}</h2>
        <p>Select a date, choose a time slot, and select the duration of your reservation.</p>
        <p>After choosing a day and time, enter your details below to reserve {room.department}-{room.name}.</p>
        <p>Please include the reason you are reserving the room.<br></br>(ex. Studying for CS-330, Software Engineering group work, Senior Project meeting)</p>
        
        <div className="scheduler">
            <div className="calendar-container">
                <div className="calendar">
                    <div className={"calendar-header " + (inThePast? "past" : "")}>
                        <button className="prev" onClick={e => backWeek()}>&#x276E;</button>
                        <span id="calendar-week">Week of {startOfWeek.toLocaleDateString("en-US", {"month":"long","day":"numeric", "year":isEndOfYear?"numeric":undefined})} - {endOfWeek.toLocaleDateString("en-US", {"month":isEndOfMonth? "long" : undefined,"day":"numeric","year":isEndOfYear? "numeric" : undefined})} 
                        </span>
                        <button className="next" onClick={e => nextWeek()}>&#x276F;</button>
                    </div>
                    <div className="calendar-grid" id="calendar-days">
                        {currentWeek.map(({past, date}) => {
                            return <div className={"calendar-day " + (past? "past" : "")} data-date={date.toISOString()} onClick={e => selectDate(date)}>{date.toLocaleDateString("en-US",{month:"short", day:"2-digit"})}</div>
                        })}
                    </div>
                </div>
            <div className="time-slots-container">
                <h4>Available Time Slots:</h4>
                <div id="time-slots">

                </div>
                <h4>Current Reservations:</h4>
                {/** TODO REMOVE || true, currently we want all reservations for testing purposes */}
                <div id="reservations">
                    {reservations.filter((r) => r.start < endOfWeek && r.end > startOfWeek || true).map((r) => {
                        return <div className="reservation" key={r.id}>
                            <p>{r.name}</p>
                            <p>{r.userID}</p>
                            <p>{r.start.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})} - {r.end.toLocaleTimeString("en-US", {hour: "2-digit", minute: "2-digit"})}</p>
                        </div>
                    })}
                </div>
            </div>
        </div>
        </div>
    </main>
}