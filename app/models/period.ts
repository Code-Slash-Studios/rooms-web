import { addMinutes, diffMinutes, HOUR_MILLI, MIN_MILLI, shiftTime } from "~/utils/datetime"
import { Reservation } from "./reservation"

const DEFAULT_PERIOD = 60
export class Period {
    start: Date
    end: Date
    name: string = ""
    id: number = -1
    isEmpty: () => true = () => true //used to distiguish between periods and reservations
    constructor(start: Date, end: Date, name?: string) {
        this.start = start;
        this.end = end;
        name? this.name = name : null;
    }
}

//returns the percentage of a day a given time period is
export function percentOfDay(start: Date, end: Date, lengthOfDay: number = 16) {
    //in our case we are scheduling 16 hour periods, so default to 16
    return 100 * Math.abs(end.getTime() - start.getTime()) / (lengthOfDay * HOUR_MILLI)
}

export const FullDay = (date: Date, filled: (Period | Reservation)[], periodLength=DEFAULT_PERIOD) => {
    //make full day of periods with reservations slotted in appropiately
    let periods: (Period | Reservation)[] = []

    // day starts at 8 AM
    let cursor = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8)
    const DAY_END = shiftTime(cursor, 16) //add 16 hours, 8am-midnight
    
    filled.forEach((r)=>{
        //gap before this reservation
        if (r.start > cursor) {
            while (diffMinutes(r.start, cursor) > periodLength) {
                const nextCursor = addMinutes(cursor, periodLength);
                periods.push(new Period(cursor, nextCursor));
                cursor = nextCursor;
            }
            periods.push(new Period(cursor, r.start));
        }
        periods.push(r)
        cursor = r.end;
    })

    if (cursor < DAY_END) {
        while (diffMinutes(cursor, DAY_END) > periodLength) {
            const nextCursor = addMinutes(cursor, periodLength);
            periods.push(new Period(cursor, nextCursor));
            cursor = nextCursor;
        }
        periods.push(new Period(cursor, DAY_END));
    }
    return periods
}
export const FullDayOpen = (date: Date, filled: (Period | Reservation)[], periodLength:number=DEFAULT_PERIOD) => {
    //make full day of periods with reservations slotted in appropiately
    let periods: Period[] = []

    let cursor = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8)
    const DAY_END = new Date(cursor.getTime() + 57600000) //add 16 hours, 8am-midnight
    
    filled.forEach((r)=>{
        //gap before this reservation
        if (r.start > cursor) {
            while (diffMinutes(r.start, cursor) >= periodLength) {
                const nextCursor = addMinutes(cursor, periodLength);
                periods.push(new Period(cursor, nextCursor));
                cursor = nextCursor;
            }
            periods.push(new Period(cursor, r.start));
        }
        cursor = r.end;
    })

    if (cursor < DAY_END) {
        while (diffMinutes(cursor, DAY_END) >= periodLength) {
            const nextCursor = addMinutes(cursor, periodLength);
            periods.push(new Period(cursor, nextCursor));
            cursor = nextCursor;
        }
        periods.push(new Period(cursor, DAY_END));
    }
    return periods
}