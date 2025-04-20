import { FullDay, percentOfDay } from "~/models/period"
import { Reservation } from "~/models/reservation"
import { genDate, genTime } from "~/utils/datetime"

interface CalendarDayProps {
    date: Date,
    reservations: Reservation[]
}

interface CalendarDayHeaderProps {
    date: Date,
    past: boolean,
    selected: boolean,
    trigger: (date: Date) => void,
}

interface BlankPeriod {
    start: Date,
    end: Date,
    name: ""
    isEmpty: () => true
}
const scale = 360000/2;

export const CalendarDayHeader = ({date, past, selected, trigger}: CalendarDayHeaderProps) => {
    const key = genDate(date)
    return <div key={key +".header"} className={"calendar-day" + (past? " past" : "") + (selected? " selected" : "")} data-date={date.toISOString()} onClick={e => trigger(date)}>{date.toLocaleDateString("en-US",{month:"short", day:"2-digit"})}</div>
}

export const CalendarDay = ({date, reservations}: CalendarDayProps) => {
    //make full day of periods with reservations slotted in appropiately
    const periods = FullDay(date, reservations)
    const key = genDate(date)
    return <div key={key +".reservations"} className="calendar-reservations">
            {periods.map((p) =>{
                if (p.isEmpty())
                    return <div className="period blank" key={key + "." + genTime(p.start, false)} title={genTime(p.start) + "-" + genTime(p.end)} style={{height: `${percentOfDay(p.start, p.end)}%`}}>
                        
                    </div>
                else
                    return <div className="period" key={key + "." + genTime(p.start, false)} title={genTime(p.start) + "-" + genTime(p.end)} style={{height: `${percentOfDay(p.start, p.end)}%`}}>
                    </div>
            })}
        </div>
}