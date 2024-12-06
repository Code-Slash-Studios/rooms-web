import Event from '../components/Event';

const Today = () => {
    const date = new Date().toLocaleDateString();
    var events = [Event({title: "Event 1", room: "W210", start: date, end: date}), Event({title: "Event 2", room: "W212", start: date, end: date})];
    return <>
        <h1>Welcome to Today! {date}</h1>
        {events.map((event) => event)}
    </>
}

export default Today;