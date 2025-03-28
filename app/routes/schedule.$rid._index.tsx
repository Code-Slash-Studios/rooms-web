import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { getRoom } from "~/api/room";


export const loader = async ({ params }:any) => {
    const roomID = params.rid
    const room = await getRoom(roomID);
    return {"room": room};
  };

const MILLIS_IN_DAY = 86400000;

export default function ScheduleRoom() {
    const {room} = useLoaderData<typeof loader>();
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [weekStart, setWeekStart] = useState(new Date(selectedDate.getTime() - selectedDate.getDay() * MILLIS_IN_DAY));
    let currentWeek = Array.from({length: 7}, (v, i) => {
        const date = new Date(weekStart.getTime() + i * MILLIS_IN_DAY);
        return {"past":date.getTime() < currentDate.getTime(),"date":date}
    });
    let endOfWeek = new Date(weekStart.getTime() + 6 * MILLIS_IN_DAY);
    const inThePast = endOfWeek < currentDate;
    const isEndOfMonth = weekStart.getMonth() != endOfWeek.getMonth();
    const isEndOfYear = weekStart.getFullYear() != endOfWeek.getFullYear();

    const selectDate = (date: Date) => {
        setSelectedDate(date);
    }

    const backWeek = () => {
        setWeekStart(new Date(weekStart.getTime() - 7 * MILLIS_IN_DAY));
    }
    const nextWeek = () => {
        setWeekStart(new Date(weekStart.getTime() + 7 * MILLIS_IN_DAY));
    }

    if (!room || room === undefined) {
        console.log(room)
        return <main><div>Room not found</div></main>
    }
    return <><main>
        <h2>{room.building} - {room.name}</h2>
        <p>Select a date, choose a time slot, and select the duration of your reservation.</p>
        <p>After choosing a day and time, enter your details below to reserve {room.building}-{room.name}.</p>
        <p>Please include the reason you are reserving the room.<br></br>(ex. Studying for CS-330, Software Engineering group work, Senior Project meeting)</p>
        
        <div className="scheduler">
            <div className="calendar-container">
                <div className="calendar">
                    <div className={"calendar-header " + (inThePast? "past" : "")}>
                        <button className="prev" onClick={e => backWeek() /** go back week // TODO make not show when in current week*/}>❮</button>
                        <span id="calendar-week">Week of {weekStart.toLocaleDateString("en-US", {"month":"long","day":"numeric", "year":isEndOfYear?"numeric":undefined})} - {endOfWeek.toLocaleDateString("en-US", {"month":isEndOfMonth? "long" : undefined,"day":"numeric","year":isEndOfYear? "numeric" : undefined})} 
                        </span>
                        <button className="next" onClick={e => nextWeek() /** advance week // TODO restrict to only some number of weeks? */}>❯</button>
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
        </div>
        </div></div>
    </main></>
}