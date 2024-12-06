import React from 'react';

interface EventProps {
    title: string;
    room: string;
    start: Date;
    end: Date;
}

const Event = (props: EventProps) => {
    return <>
        <div className="event">
            <h1>{props.title} in {props.room}</h1>
            <h2>{props.start.toString()} - {props.end.toString()}</h2>
            <p>Referer</p>
        </div>
    </>
}

export default Event;