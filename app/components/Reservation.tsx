import "./Reservation.css";
interface ReservationProps {
    title: string;
    room: string;
    start: Date;
    end: Date;
}

const Reservation = class {
    title: string;
    room: string;
    start: Date;
    end: Date;
    constructor(title: string, room: string, start: Date, end: Date) {
        this.title = title;
        this.room = room;
        this.start = start;
        this.end = end;
    }
    toString() {
        return `${this.title} in ${this.room} from ${this.start.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})} to ${this.end.toLocaleString("en-US", {hour: 'numeric', minute: '2-digit'})}`;
    }
    render() {
        return <ReservationComp title={this.title} room={this.room} start={this.start} end={this.end} />;
    }
}

const ReservationComp = (props: ReservationProps, timeOnly = false) => {
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

export default ReservationComp;