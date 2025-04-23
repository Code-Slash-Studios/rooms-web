import { Link } from "@remix-run/react"
import { useEffect, useState } from "react"
import { FullDay, percentOfDay } from "~/models/period"
import { Reservation } from "~/models/reservation"
import { genDate, genTime } from "~/utils/datetime"

interface CalendarDayProps {
    date: Date,
    reservations: Reservation[]
    setDateTime: (datetime: Date) => void,
    past: boolean,
}

interface CalendarDayHeaderProps {
    date: Date,
    past: boolean,
    endOfMonth: boolean,
    selected: boolean,
    trigger: (date: Date) => void,
}
const scale = 360000/2;

export const CalendarDayHeader = ({date, past, selected, trigger, endOfMonth}: CalendarDayHeaderProps) => {
    const key = genDate(date)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);
    const isMobile = screenWidth < 600; // Adjust the breakpoint as needed
    useEffect(() => {
        const handleResize = () => {
          setScreenWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, []);
    return <div key={key +".header"} className={"calendar-day" + (past? " past" : "") + (selected? " selected" : "")} data-date={date.toISOString()} onClick={e => trigger(date)}>{date.toLocaleDateString("en-US",{month:(isMobile? endOfMonth? "narrow" : undefined : "short"), day:"2-digit"})}</div>
}

export const CalendarDay = ({date, reservations, setDateTime, past}: CalendarDayProps) => {
    //make full day of periods with reservations slotted in appropiately
    const periods = FullDay(date, reservations)
    const key = genDate(date)
    
    return <div key={key +".reservations"} className={"calendar-reservations"}>
            {periods.map((p) =>{
                const past = p.start < new Date()
                if (p.isEmpty())
                    return <div className="period blank" key={"blank" + "." + key + "." + genTime(p.start, false)} title={genTime(p.start) + "-" + genTime(p.end)} style={{height: `${percentOfDay(p.start, p.end)}%`}}>
                    <a onClick={(e) => {e.preventDefault();setDateTime(p.start)}} href="" className="fill">
                        {p.start.getDay() === 0 && genTime(p.start)}
                    </a>
                    </div>
                else
                    return <div className={"period"+(past? " past" : "")} key={key + "." + genTime(p.start, false)} title={p.name + " " + genTime(p.start) + "-" + genTime(p.end)} style={{height: `${percentOfDay(p.start, p.end)}%`}}>
                    <Link to={"/reservation/" + p.id} className="fill">
                        {p.start.getDay() === 0 && genTime(p.start)}
                    </Link>
                    </div>
            })}
        </div>
}