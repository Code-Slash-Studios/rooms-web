export const MIN_MILLI = 60000
export const HOUR_MILLI = MIN_MILLI * 60
export const DAY_MILLI = HOUR_MILLI * 24

export interface Time { //24hr format
    hour: number
    minute: number
}

export function startOfDay(date?: Date) {
    if (date === undefined) {
        date = new Date();
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0)
}
export function endOfDay(date?: Date) {
    if (date === undefined) {
        date = new Date();
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

export function toDatetimeLocal(date: Date) {
    const pad = (num: number) => num.toString().padStart(2, '0');
    if (date == undefined) {
        return "";
    }
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1); // Months are 0-indexed.
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
export function fromDatetimeLocal(datetimeLocal: string) {
    const [date, time] = datetimeLocal.split('T');
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
}

export function sameDay(date1: Date, date2: Date) {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear()
}
export function genDate(date: Date) {
    return date.toLocaleDateString("en-US", {timeZone:"America/New_York",month:"short",day:"2-digit"})
}
export function genTime(datetime: Date, hour12: boolean = true) {
    return datetime.toLocaleTimeString("en-US", {timeZone:"America/New_York", hour:"numeric", minute:"2-digit", hour12:hour12})
}

export function genHour(datetime: Date) {
    return parseInt(datetime.toLocaleTimeString("en-US", {timeZone:"America/New_York", hour:"numeric", hour12: false}))
}

export function diffHours(date1: Date, date2: Date) {
    return Math.abs(
        (date1.getTime() - date2.getTime()) / HOUR_MILLI
    )
}
export function diffMinutes(date1: Date, date2: Date) {
    return Math.abs(
        (date1.getTime() - date2.getTime()) / MIN_MILLI
    )
}
export function shiftDate(date: Date, days: number = 0, hours: number = 0, minutes = 0) {
    return new Date(date.getTime() + days*DAY_MILLI + hours*HOUR_MILLI + minutes*MIN_MILLI)
}
export function shiftTime(date: Date, hours: number = 0, minutes: number = 0) {
    return new Date(date.getTime() + hours*HOUR_MILLI + minutes*MIN_MILLI)
}

export function addMinutes(date: Date, minutes: number){
    return new Date(date.getTime() + minutes*MIN_MILLI)
}