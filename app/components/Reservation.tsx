import "./Reservation.css";
interface ReservationProps {
    title: string;
    room: string;
    start: Date;
    end: Date;
}

const Reservation = (props: ReservationProps, timeOnly = false) => {
    if (timeOnly) {
        //time with hours and minutes (no seconds)
        var start = props.start.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
        var end = props.end.toLocaleTimeString("en-US", {hour: 'numeric', minute: '2-digit'});
    } else {
        //full date and time with hours and minutes (no seconds)
        var start = props.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
        var end = props.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric'});
    }
    return <>
        <div className="event" key="{props.title}">
            <h1><u>{props.title}</u> in {props.room}</h1>
            <h2>{start} - {end}</h2>
        </div>
    </>
}

export default Reservation;