import { useEffect, useState } from "react"
import { Period, FullDayOpen } from "~/models/period";
import { Reservation } from "~/models/reservation";
import { genHour, genTime } from "~/utils/datetime";

interface SelectTimeProps {
    date: Date,
    reservations: Reservation[]
    setTime: (time: Date) => void
}

export function SelectTime({date, reservations, setTime}: SelectTimeProps) {
    const [PM, setPM] = useState(true);
    //separate available time periods by period
    const [openAM,setOpenAM] = useState<Period[]>([])
    const [openPM,setOpenPM] = useState<Period[]>([])
    useEffect(() => {
        const periods = FullDayOpen(date, reservations, 15) //gets all blank periods (no reservations)
        setOpenAM(periods.filter((p)=> genHour(p.start) < 12 && genHour(p.start) > 0))
        setOpenPM(periods.filter((p)=> genHour(p.start) >= 12))
    }, [reservations])

    const handlePMSelect = (event: any) => {
        setPM(event.target.value === "1")
    }

    return <div className="selectTime">
        <select title="hour">
            {PM? openPM.map((p) => <option value={genHour(p.start)}>{genHour(p.start)}</option>)
                : openAM.map((p) => <option value={genHour(p.start)}>{genHour(p.start)}</option>)
            }
        </select>
        <select title="minute">
            <option value={"00"}>00</option>
            <option value={"15"}>15</option>
            <option value={"30"}>30</option>
            <option value={"45"}>45</option>
        </select>
        <select title="am/pm" onChange={handlePMSelect}>
            <option value={0} selected={!PM}>AM</option>
            <option value={1} selected={PM}>PM</option>
        </select>
    </div>
}