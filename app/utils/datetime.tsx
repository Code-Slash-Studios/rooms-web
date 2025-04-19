export function startOfDay(date?: Date) {
    if (date === undefined) {
        date = new Date();
    }
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0)
}

export function toDatetimeLocal(date: Date) {
    const pad = (num: number) => num.toString().padStart(2, '0');
    if (date == undefined) {
        return "";
    }
    date = new Date(date);
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