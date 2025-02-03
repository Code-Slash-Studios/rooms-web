import ReservationComp from '~/components/Reservation';

export default function You() {
    const date = new Date();
    const newDate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 2, date.getHours() + 2, date.getMinutes(), date.getSeconds());
    var events = [ReservationComp({title: "Some Event", room: "W210", start: newDate, end: newDate})];
    return <>
        <h1>Here are your events</h1>
        {events.map((event) => event)}
    </>
}