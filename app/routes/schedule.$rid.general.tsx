import { ActionFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Form, redirect, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { createReservation, getReservationsByRoomId } from "~/api/reservation";
import { getRoom } from "~/api/room";
import { CalendarDay, CalendarDayHeader } from "~/components/calendarDay";
import { SelectTime } from "~/components/SelectTime";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { getRequestUser, loginRequired } from "~/services/auth";
import { genHour, sameDay, shiftTime, Time } from "~/utils/datetime";

export const loader = async ({ params, request }: ClientLoaderFunctionArgs) => {
    const user = await getRequestUser(request);
    const roomID = params.rid
    if (!roomID) {
        throw new Response("Room ID not found", {status: 404});
    }
    if (user) {
        throw redirect(`/schedule/${roomID}`)
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
    const {roomData, reservationsData, user} = useLoaderData<typeof loader>();

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    //handle date display:
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<Time>({hour: 12, minute: 0}); //default to 12 PM noon
    const [selectedReservations, setSelectedReservations] = useState<Reservation[]>([]);
    const [currentWeek, setCurrentWeek] = useState<{past:boolean,date:Date,rs:Reservation[]}[]>([]);
    const durationList = [30, 60, 90, 120]
    // selectedDate.setHours(0,0,0,0);
    const startOfSelected = new Date(selectedDate.getTime());
    startOfSelected.setHours(0,0,0,0);
    const endOfSelected = new Date(selectedDate.getTime());
    endOfSelected.setHours(23,59,59,999);
    
    const [startOfWeek, setWeekStart] = useState(new Date(selectedDate.getTime() - selectedDate.getDay() * MILLIS_IN_DAY));
    let count = 0;
    
    const endOfWeek = new Date(startOfWeek.getTime() + 6 * MILLIS_IN_DAY);
    const inThePast = endOfWeek < currentDate;
    const isEndOfMonth = startOfWeek.getMonth() != endOfWeek.getMonth();
    const isEndOfYear = startOfWeek.getFullYear() != endOfWeek.getFullYear();

    useEffect(() => {
        // set room data to the state
        if (roomData != undefined) {
            setRoom(
                Room.fromJSON(roomData),
            );
        }
        if (reservationsData != undefined) {
            setReservations(
                Reservation.factory(reservationsData),
            );
        }

    }, [roomData, reservationsData]);

    useEffect(() => {
        // occurs when week is changed
        let currentWeek = Array.from({length: 7}, (v, i) => {
            const date = new Date(startOfWeek.getTime() + i * MILLIS_IN_DAY);
            const localReservations = reservations.filter((r) => sameDay(date, r.start))
            count += localReservations.length;
            return {"past":date.getTime() < currentDate.getTime(),"date":date, "rs": localReservations}
        });
        setCurrentWeek(currentWeek)
    }, [startOfWeek, reservations])
    useEffect(() => {
        setSelectedReservations(reservations.filter((r) => sameDay(r.start, selectedDate)));
    },[selectedDate])

    //used to fill form from calendarDay
    const selectDateTime = (datetime: Date) => {
        setSelectedDate(datetime);
        setSelectedTime({hour: genHour(datetime), minute: datetime.getMinutes()});
    }

    //button actions
    const selectDate = (date: Date) => {
        setSelectedDate(date);
    }

    const backWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() - 7 * MILLIS_IN_DAY));
    }
    const nextWeek = () => {
        setWeekStart(new Date(startOfWeek.getTime() + 7 * MILLIS_IN_DAY));
    }
    // error states
    if (!roomData || roomData === undefined) {
        return <main><div>Room not found or Loading...</div></main>
    }
    if (room == undefined) {
        return <main><div>Loading...</div></main>
    }

    return <main>
        <div className="scheduler">
            <div className="calendar-container">
            <h2>{room.department} {room.id} - {room.name}</h2>
                <div className="calendar">
                    <div className={"calendar-header " + (inThePast? "past" : "")}>
                        <button className="prev" onClick={e => backWeek()}>&#x276E;</button>
                        <span id="calendar-week">
                            {startOfWeek.toLocaleDateString("en-US", {timeZone:"America/New_York","month":"long","day":"numeric", "year":isEndOfYear?"numeric":undefined})} - {endOfWeek.toLocaleDateString("en-US", {"month":isEndOfMonth? "long" : undefined,"day":"numeric","year":isEndOfYear? "numeric" : undefined})}
                        </span>
                        <button className="next" onClick={e => nextWeek()}>&#x276F;</button>
                    </div>
                    <div className="calender-grid-header" id="calender-grid-header">
                        {currentWeek.map(({past, date}) =>
                            <CalendarDayHeader endOfMonth={isEndOfMonth} date={date} past={past} selected={sameDay(date, selectedDate)} trigger={selectDate} key={date.toLocaleDateString()}></CalendarDayHeader>
                        )}
                    </div>
                    <div className="calendar-grid" id="calendar-grid">
                        {currentWeek.map(({past, date, rs}) =>
                            <div className="calendar-grid-col" key={date.toLocaleDateString()}>
                                <CalendarDay past={past} date={date} reservations={rs} setDateTime={selectDateTime} user={user}></CalendarDay>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        </div>
        <h3>Help Text:</h3>
        <p>Please note that you will not be able to access any further details unless you <b>login</b>.</p>
    </main>
}