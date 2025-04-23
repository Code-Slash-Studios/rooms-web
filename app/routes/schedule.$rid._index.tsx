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
import { genHour, sameDay, shiftTime, Time } from "~/utils/datetime";

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
    //const customDurationRef = useRef<HTMLInputElement>(null);

    const [actionResponse, setActionResponse] = useState(response);
    const [formStatus, setFormStatus] = useState<string | null>(null);
    const [isValid, setIsValid] = useState(false);

    const [room, setRoom] = useState<Room | undefined>(undefined);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    //handle date display:
    const currentDate = new Date();
    currentDate.setHours(0,0,0,0);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<Time>({hour: 12, minute: 0}); //default to 12 PM noon
    const [duration, setDuration] = useState(60)
    const [title, setTitle] = useState("");
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
        if (actionResponse !== undefined) {
            if (actionResponse.message === "Reservation created") {
                alert("Reservation created successfully!");
                resetForm();
                setActionResponse(undefined);
            } else {
                alert(actionResponse.message);
                setFormStatus(actionResponse.message);
            }
        }
    }, [actionResponse]);

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
        console.log("selectedDate")
        setSelectedReservations(reservations.filter((r) => sameDay(r.start, selectedDate)));
    },[selectedDate])

    //time till next reservation (with currently selected date and time)
    useEffect(() => {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute);
        const end = new Date(start.getTime() + (60 * 60 * 1000));
        //check up to the next hour:
        const next = reservations.filter((r) => {
            return (r.start < end && start < r.end) || (r.start > start && r.start < end) || (start > r.start && end < r.end)
        })
        //setMinutesAvailable([15, 30, 45, 60].filter((v => {v <= nextMinutes})))
    }, [selectedDate, selectedTime, reservations])

    const resetForm = () => {
        if (formRef.current) {
            formRef.current?.reset();
        }
        setSelectedDate(new Date());
        setDuration(60);
        setTitle("");
    }

    //used to fill form from calendarDay
    const selectDateTime = (datetime: Date) => {
        console.log("selectDateTime", datetime)
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
    const isOverlappingDuration = (_duration: number) => {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute);
        const end = new Date(start.getTime() + (_duration * 60 * 1000));
        return isOverlapping(start, end).length !== 0;
    }
    const isOverlapping = (start: Date, _end: Date) => {
        return reservations.filter((r) => {
            return (r.start < _end && start < r.end) || (r.start > start && r.start < _end) || (start > r.start && _end < r.end)
        })
    }
    const checkIsValid = () => {
        const start = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), selectedTime.hour, selectedTime.minute);
        const end = new Date(start.getTime() + (duration * 60 * 1000));
        let save = new Reservation(-1, title, room?.id || "-1", user.id, start, end);
        const isValid = save.isValid();
        if (!isValid.valid) {
            setFormStatus(isValid.message);
            return false;
        }
        if (isOverlapping(start, end).length !== 0) {
            setFormStatus("Reservation overlaps with existing reservations");
            return false;
        }
        if (start.getTime() < Date.now()) {
            setFormStatus("Reservation start time cannot be in the past");
            return false;
        }
        return save;
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const save = checkIsValid();
        if (!save) {
            setFormStatus("Reservation Failed");
            alert("Reservation Failed: " + formStatus);
            return;
        }
        submit(
            { "title": save.name, "room": save.roomID, "start": save.start.toISOString(), "end": save.end.toISOString()},
            {method: "POST", action: "", replace: true}
        )
    } 

    const durationShortHand = (duration: number) => {
        switch (duration) {
            case 30:
                return "30 min"
            case 60:
                return "1 hr"
            case 90:
                return "90 min"
            case 120:
                return "2 hrs"
            default:
                return duration + " min"
        }
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
                                <CalendarDay past={past} date={date} reservations={rs} setDateTime={selectDateTime}></CalendarDay>
                            </div>
                        )}
                    </div>
                </div>
                <Form ref={formRef} className="time-slots-container" onSubmit={(e) => handleSubmit(e)} method="post" action="" id="time-slots-form">
                    <h4 key={"today-label"} className="today-label" style={{float:"right"}}>{selectedDate.toLocaleDateString("en-US", {"timeZone":"America/New_York", "month":"short","day":"numeric","year":isEndOfYear? "numeric" : undefined})}</h4>
                    <label htmlFor="name">Reservation Name: </label>
                    <input type="text" id="name" name="name" className="long" required={true} onChange={(e) => setTitle(e.target.value)} value={title} placeholder="E.g. CIS Project Meeting, mx 100" maxLength={100}></input>
                    <h4 key={"available-label"} className="available-label">Available Time Slots:</h4>
                    <div id="time-slots">
                        <SelectTime date={selectedDate} reservations={selectedReservations} time={selectedTime} setTime={setSelectedTime} ></SelectTime>
                        <div id="duration-container" className="duration-container">
                            {durationList.map(((v)=>
                                <button className={(duration === v)? "duration selected" : "duration"} key={v} type="button" onClick={(e) => setDuration(v)} disabled={isOverlappingDuration(v)}>{durationShortHand(v)}</button>
                            ))}
                            {/* CUSTOM DURATION IMPLEMENTATION: <button title="custom-duration-button" type="button" className={"duration input" + (durationList.find((v) => v === duration)? "" : " selected")} key="custom" onClick={(e) => setDuration(parseInt(customDurationRef.current?.value || "60"))}><input ref={customDurationRef} title="custom-duration-input" type="number" onChange={(e)=> setDuration(parseInt(e.target.value))} value={duration} step={15} max={180} min={0}></input></button> */}
                        </div>
                    </div>
                    <button type="submit" className="full-width" disabled={!isValid}>Submit</button>
                    {!isValid && <div className={"form-status"}>{formStatus}</div>}
                </Form>
            </div>
        </div>
        <h3>Help Text:</h3>
        <p>Select a date, choose a time slot, and select the duration of your reservation.</p>
        <p>Also make sure to input a reservation name.</p>
    </main>
}