import Reservation from '../../components/Reservation';

export default function Today() {
    const time = new Date();
    const time2 = new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours() + 2, time.getMinutes(), time.getSeconds());
    var events = [Reservation({title: "Event 1", room: "W210", start: time, end: time}, true), Reservation({title: "Event 2", room: "W212", start: time2, end: time2}, true)];
    return <>
        <h1>Welcome to Today! {time.toLocaleDateString("en-US", {month: "long", day:"numeric"})}</h1>
        {events.map((event) => event)}
    </>
}
