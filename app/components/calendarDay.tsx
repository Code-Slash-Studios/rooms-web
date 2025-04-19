import { Reservation } from "~/models/reservation"
import { genTime } from "~/utils/datetime"

interface CalendarDayProps {
    date: Date,
    reservations: Reservation[]
    blank: boolean,
    past: boolean,
    selected: boolean,
    triggerSelect: (date: Date) => void
}

interface BlankPeriod {
    start: Date,
    end: Date,
    name: ""
    isEmpty: () => true
}
const scale = 360000/2;

export const CalendarDay = ({date, reservations, blank, past, selected, triggerSelect: trigger}: CalendarDayProps) => {
    //make full day of periods with reservations slotted in appropiately
    date.setHours(8,0,0,0)
    const DAY_END = new Date(date.getTime() + 57600000) //add 16 hours
    let cursor = date
    let periods: (Reservation | BlankPeriod)[] = []
    reservations.forEach((r)=>{
        //gap before this reservation
        if (r.start > cursor) {
            periods.push({
                start: cursor,
                end: r.start,
                name: "",
                isEmpty: () => true
            })
        }
        periods.push(r)
        cursor = r.end;
    })
    if (cursor < DAY_END) {
        periods.push({
            start: cursor,
            end: DAY_END,
            name: "",
            isEmpty: () => true
        })
    }
    console.log(periods)
    return <div className="calendar-day-col">
        <div className={"calendar-day" + (past? " past" : "") + (selected? " selected" : "")} data-date={date.toISOString()} onClick={e => trigger(date)}>{date.toLocaleDateString("en-US",{month:"short", day:"2-digit"})}</div>
        <div className="calendar-reservations">
            {!blank && periods.map((p) =>{
                if (p.isEmpty())
                    return <div className="period blank" title={genTime(p.start) + "-" + genTime(p.end)} style={{height: (p.end.getTime() - p.start.getTime())/scale}}>
                        
                    </div>
                else
                    return <div className="period" title={genTime(p.start) + "-" + genTime(p.end)} style={{height: (p.end.getTime() - p.start.getTime())/scale}}>
                    
                    </div>
            })}
        </div>
    </div>    
}