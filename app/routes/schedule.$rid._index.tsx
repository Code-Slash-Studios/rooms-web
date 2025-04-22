import { ActionFunctionArgs } from "@remix-run/node";
import { ClientLoaderFunctionArgs, Form, useActionData, useLoaderData, useSubmit } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { createReservation, getReservationsByRoomId } from "~/api/reservation";
import { getRoom } from "~/api/room";
import { CalendarDay, CalendarDayHeader } from "~/components/calendarDay";
import { SelectTime } from "~/components/SelectTime";
import { Reservation } from "~/models/reservation";
import { Room } from "~/models/room";
import { loginRequired } from "~/services/auth";
import { sameDay, shiftTime, Time } from "~/utils/datetime";

export const action = async ({request}: ActionFunctionArgs) => {
    const user = await loginRequired(request);
    const formData = await request.formData();
    console.log(formData)
    const title = formData.get("title")?.toString() || "";
    const roomID = formData.get("room")?.toString() || "";
    let start = formData.get("start")?.toString() || undefined;
    let end = formData.get("end")?.toString() || undefined;
    let startDate: Date | undefined = undefined;
    let endDate: Date | undefined = undefined;
    if (start) {
        startDate = new Date(start);
        if (end)
            endDate = new Date(end);
        else 
            endDate = shiftTime(startDate, 1); //default to 1 hour later //default to 1 hour later
    } else {
        startDate = new Date();
        endDate = shiftTime(startDate, 1) //default to 1 hour later
    }
    let save = new Reservation(-1, title, roomID, user.id, startDate, endDate);
    const isValid = save.isValid();
    if (isValid.valid) {
        return createReservation(save).then((res) => {
            return {message: "Reservation created"}
        });
    } else {
        return {message: "Invalid reservation data:" + isValid.message};
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
    const submit = useSubmit();
    const {roomData, reservationsData, user} = useLoaderData<typeof loader>();
    const response = useActionData<typeof action>();
    const formRef = useRef<HTMLFormElement>(null);

    const [actionResponse, setActionResponse] = useState(response);

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    //handle date display:
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<Time>({hour: 12, minute: 0}); //default to 12 PM noon
    const [duration, setDuration] = useState(60)
    const [title, setTitle] = useState("");
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
        if (actionResponse !== undefined) {
            if (actionResponse.message === "Reservation created") {
                alert("Reservation created successfully!");
                resetForm();
                setActionResponse(undefined);
            } else {
                alert(actionResponse.message);
            }
        }
    }, [actionResponse]);

    const resetForm = () => {
        if (formRef.current) {
            formRef.current?.reset();
        }
        setSelectedDate(new Date());
        setDuration(60);
        setTitle("");
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
    const isOverlapping = (start: Date, _end: Date) => {
        return reservations.filter((r) => {
            return (r.start < _end && start < r.end) || (r.start > start && r.start < _end) || (start > r.start && _end < r.end)
        })
    }
    const isValid = () => {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute);
        const end = new Date(start.getTime() + (duration * 60 * 1000));
        let save = new Reservation(-1, title, room?.id || "-1", user.id, start, end);
        const isValid = save.isValid();
        if (!isValid.valid) {
            return false;
        }
        const state = isOverlapping(start, end).length === 0 && end.getTime() > Date.now()
        return state;
    }

    const handleSubmit = (e: any) => {
        console.log("submitSchedule")
        e.preventDefault();
        const roomID = room?.id || "-1";
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute);
        const end = new Date(start.getTime() + (duration * 60 * 1000));
        let save = new Reservation(-1, title, roomID, user.id, start, end);
        const isValid = save.isValid();
        if (!isValid.valid) {
            alert("Invalid reservation data:" + isValid.message);
            return;
        }
        if (start.getTime() < Date.now()) {
            alert("You cannot reserve a room in the past. Please choose a different time.");
            return;
        }
        //check if this period exists in periods:

        if (isOverlapping(start, end).length > 0) {
            alert("This reservation overlaps with an existing reservation. Please choose a different time or duration.");
            return;
        }

        submit(
            { "title": title, "room": roomID, "start": start.toISOString(), "end": end.toISOString() },
            {method: "post", action: "", replace: true}
        )
    } 

    // error states
    if (!roomData || roomData === undefined) {
        console.log(roomData)
        return <main><div>Room not found or Loading...</div></main>
    }
    if (room == undefined) {
        return <main><div>Loading...</div></main>
    }

    return <main>
        <div className="scheduler">
            <div className="calendar-container">
            <h2>{room.department} - {room.name}</h2>
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
                <Form ref={formRef} className="time-slots-container" onSubmit={(e) => handleSubmit(e)} method="post" action="" id="time-slots-form">
                    <h4 key={"today-label"} className="today-label" style={{float:"right"}}>{selectedDate.toLocaleDateString("en-US", {"timeZone":"America/New_York", "month":"short","day":"numeric","year":isEndOfYear? "numeric" : undefined})}</h4>
                    <label htmlFor="name">Reservation Name: </label>
                    <input type="text" id="name" name="name" className="long" required={true} onChange={(e) => setTitle(e.target.value)}></input>
                    <h4 key={"available-label"} className="available-label">Available Time Slots:</h4>
                    <div id="time-slots">
                        <SelectTime date={selectedDate} reservations={selectedReservations} setTime={setSelectedTime} ></SelectTime>
                    
                        <div id="duration-container" className="duration-container">
                            {[15, 30, 45, 60].map(((v)=>
                                <button className={(duration === v)? "duration selected" : "duration"} key={v} type="button" onClick={(e) => setDuration(v)}>{v} min</button>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="full-width" style={{display:(isValid()? "inline-block" : "none")}}>Submit</button>
                </Form>
            </div>
        </div>
        <h3>Help Text:</h3>
        <p>Select a date, choose a time slot, and select the duration of your reservation.</p>
        <p>Also make sure to input a reservation name {room.department}-{room.name}.</p>
        <p>Please include the reason you are reserving the room.<br></br>(ex. Studying for CS-330, Software Engineering group work, Senior Project meeting)</p>
        

    </main>
}