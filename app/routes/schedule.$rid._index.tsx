import { ActionFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { createReservation, getReservationsByRoomId } from "~/api/reservation";
import { getRoom } from "~/api/room";
import { CalendarDay, CalendarDayHeader } from "~/components/calendarDay";
import { SelectTime } from "~/components/SelectTime";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { loginRequired } from "~/services/auth";
import { sameDay } from "~/utils/datetime";

export const action = async ({request}: ActionFunctionArgs) => {
    const user = await loginRequired(request);
    const formData = await request.formData();
    const title = formData.get("title")?.toString() || "";
    const roomID = formData.get("room")?.toString() || "";
    const start = new Date(formData.get("start-date") + "T" + formData.get("start-time"));
    const duration: number = parseInt(formData.get("duration")?.toString() || "60");
    const end = new Date(start.getTime() + (duration * 60 * 1000));
    let save = new Reservation(-1, title, roomID, user.id, start, end)
    const isValid = save.isValid();
    if (isValid.valid) {
        return createReservation(save).then((res) => {
            return res;
        });
    } else {
        return "Invalid reservation data:" + isValid.message;
    }
}

export const loader = async ({ params, request }: ClientLoaderFunctionArgs) => {
    const user = await loginRequired(request);
    const roomID = params.rid
    if (!roomID) {
        throw new Response("Room ID not found", {status: 404});
    }
    const reservations = await getReservationsByRoomId(roomID);
    const room = await getRoom(roomID);
    if (!room) {
        throw new Response("Room not found", {status: 404});
    }
    return {"roomData": room.toJSON(), "user": user, "reservationsData": reservations.map((r) => r.toJSON())};
  };

const MILLIS_IN_DAY = 86400000;

export default function ScheduleRoom() {
    const {roomData, reservationsData} = useLoaderData<typeof loader>();

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    let selectedReservations: Reservation[] = []
    // selectedDate.setHours(0,0,0,0);
    const startOfSelected = new Date(selectedDate.getTime());
    startOfSelected.setHours(0,0,0,0);
    const endOfSelected = new Date(selectedDate.getTime());
    endOfSelected.setHours(23,59,59,999);
    
    const [startOfWeek, setWeekStart] = useState(new Date(selectedDate.getTime() - selectedDate.getDay() * MILLIS_IN_DAY));
    let count = 0;
    let currentWeek = Array.from({length: 7}, (v, i) => {
        const date = new Date(startOfWeek.getTime() + i * MILLIS_IN_DAY);
        const localReservations = reservations.filter((r) => sameDay(date, r.start))
        if (i === selectedDate.getDay()) {
            selectedReservations = localReservations
        }
        count += localReservations.length;
        return {"past":date.getTime() < currentDate.getTime(),"date":date, "rs": localReservations}
    });
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * MILLIS_IN_DAY);
    const inThePast = endOfWeek < currentDate;
    const isEndOfMonth = startOfWeek.getMonth() != endOfWeek.getMonth();
    const isEndOfYear = startOfWeek.getFullYear() != endOfWeek.getFullYear();

    const [duration, setDuration] = useState(60)

    useEffect(() => {
        // set room data to the state
        if (roomData != undefined) {
            setRoom(
                Room.fromJSON(roomData),
            );
        }
        if (reservations != undefined) {
            setReservations(
                Reservation.factory(reservationsData),
            );
        }

    }, [roomData, reservationsData]);

    const selectDate = (date: Date) => {
        setSelectedDate(date);
    }

    const backWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() - 7 * MILLIS_IN_DAY));
    }
    const nextWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() + 7 * MILLIS_IN_DAY));
    }

    if (!roomData || roomData === undefined) {
        console.log(roomData)
        return <main><div>Room not found or Loading...</div></main>
    }
    if (room == undefined) {
        return <main><div>Loading...</div></main>
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
                        <span id="calendar-week">Week of {startOfWeek.toLocaleDateString("en-US", {timeZone:"America/New_York","month":"long","day":"numeric", "year":isEndOfYear?"numeric":undefined})} - {endOfWeek.toLocaleDateString("en-US", {"month":isEndOfMonth? "long" : undefined,"day":"numeric","year":isEndOfYear? "numeric" : undefined})} 
                        </span>
                        <button className="next" onClick={e => nextWeek()}>&#x276F;</button>
                    </div>
                    <div className="calendar-grid" id="calendar-days">
                        {currentWeek.map(({past, date, rs}) =>
                            <div className="calendar-grid-col" key={date.toLocaleDateString()}>
                                <CalendarDayHeader date={date} past={past} selected={sameDay(date, selectedDate)} trigger={selectDate}></CalendarDayHeader>
                                <CalendarDay date={date} reservations={rs}></CalendarDay>
                            </div>
                        )}
                    </div>
                </div>
                <div className="time-slots-container">
                    <h3>Selected: {selectedDate.toLocaleDateString("en-US", {"timeZone":"America/New_York", "month":"short","day":"numeric","year":isEndOfYear? "numeric" : undefined})}</h3>
                    <form>
                        <h4>Available Time Slots:</h4>
                        <div id="time-slots">
                            <SelectTime date={selectedDate} reservations={selectedReservations} setTime={()=>null} ></SelectTime>
                        
                            <div id="duration-container">
                                <button className="time-slot" type="button">+15 min</button>
                                <button className="time-slot" type="button">+30 min</button>
                                <button className="time-slot" type="button">+45 min</button>
                                <button className="time-slot" type="button">+60 min</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </main>
}