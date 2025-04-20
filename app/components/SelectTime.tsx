import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { Period, FullDayOpen } from "~/models/period";
import { Reservation } from "~/models/reservation";
import { genHour, genTime, shiftTime, startOfDay } from "~/utils/datetime";
import "./SelectTime.css";

interface SelectTimeProps {
    date: Date;
    reservations: Reservation[];
    setTime: (time: Date) => void;
}

export function SelectTime({ date, reservations, setTime }: SelectTimeProps) {
    const [PM, setPM] = useState(true);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [openAM, setOpenAM] = useState<Period[]>([]);
    const [openPM, setOpenPM] = useState<Period[]>([]);
    const [dropped, setDropped] = useState(false);
    const [hour, setHour] = useState<number | undefined>(undefined);
    const [minute, setMinute] = useState("00");

    const selectedTime = hour
        ? shiftTime(startOfDay(date), hour, parseInt(minute))
        : undefined;

    // Build lists
    const hoursList = (PM ? openPM : openAM).filter(
        (p) => p.start.getMinutes() === 0
    );
    const minuteList = hour
        ? periods
            .filter((p) => genHour(p.start) === hour)
            .map((p) => p.start.toTimeString().split(":")[1])
        : ["00", "15", "30", "45"];

    // Refs for infinite scroll
    const hoursRef = useRef<HTMLDivElement>(null);
    const minutesRef = useRef<HTMLDivElement>(null);

    // Recompute openAM/openPM whenever reservations change
    useEffect(() => {
        const all = FullDayOpen(date, reservations, 15);
        setPeriods(all);
        setOpenAM(all.filter((p) => genHour(p.start) < 12 && genHour(p.start) > 0));
        setOpenPM(all.filter((p) => genHour(p.start) >= 12));
    }, [date, reservations]);
    useLayoutEffect(() => {
        if (!dropped) return;
        /**
         * Centers the `selected` element (from the *unique* values array) 
         * in the middle copy of a triple‑rendered list.
         */
        const frame = requestAnimationFrame(() => { function centerOn<T>(
          ref: React.RefObject<HTMLDivElement>,
          values: T[],              // the ORIGINAL array, e.g. [0,1,2,3…11] or ['00','15'…]
          selected: T | undefined
        ) {
            const node = ref.current;
            if (!node) return;
        
            // grab one item to measure
            const itemEl = node.querySelector('button');
            if (!itemEl) return;
            const itemH = itemEl.clientHeight + 5;
            const containerH = node.clientHeight;
            const len = values.length;
        
            // find the index INSIDE the unique array
            const selIdx = selected != null 
                ? values.findIndex(v => v === selected) 
                : -1;
        
            // if nothing selected, just go to the top of the middle copy
            const idx = selIdx >= 0 ? selIdx : 0;
        
            // scrollTop so that (middle‑copy + idx)·itemH + itemH/2  ==  containerH/2
            const targetScroll =
                (len + idx) * itemH      // jump into 2nd copy + idx items
                + itemH / 2              // go to the *middle* of that item
                - containerH / 2;        // bring it up to the container’s center
        
            node.scrollTop = targetScroll;
            }
        
            // HOURS — map your Period[] → number[]
            centerOn(
            hoursRef,
            hoursList.map(p => genHour(p.start)),
            hour
            );
        
            // MINUTES — you already have the unique minuteList: string[]
            centerOn(minutesRef, minuteList, minute);
        });

        return () => {
            cancelAnimationFrame(frame);
        };
      }, [dropped, PM, hour, minute, hoursList, minuteList]);

    // close popover on outside click
    useEffect(() => {
        const onClickOutside = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest(".time-picker")) {
                setDropped(false);
            }
        };
        document.addEventListener("mousedown", onClickOutside);
        return () => document.removeEventListener("mousedown", onClickOutside);
    }, []);

    // center each list in the _middle_ copy whenever the popover opens or AM/PM toggles
    useLayoutEffect(() => {
        if (!dropped) return;

        const center = (ref: React.RefObject<HTMLDivElement>, length: number) => {
            const node = ref.current;
            if (!node || node.children.length === 0) return;
            const itemH = node.children[0].clientHeight;
            node.scrollTop = itemH * length; // jump to the start of the *second* copy
        };

        center(hoursRef, hoursList.length);
        center(minutesRef, minuteList.length);
    }, [dropped]);

    // wrap‑around logic
    const infiniteScroll = (e: React.UIEvent<HTMLDivElement>, length: number) => {
        const node = e.currentTarget;
        const itemH = node.children[0].clientHeight;
        const full = (itemH + 5) * length; // +4 +1 take into account margin and border
        if (node.scrollTop <= 0) {
            node.scrollTop += full;
        } else if (node.scrollTop >= full * 2) {
            node.scrollTop -= full;
        }
    };
    const handleSetPM = (pm: boolean) => {
        const h = hour? hour : 12
        if (pm) {
            setPM(true)
            setHour(h);
        } else {
            setPM(false)
            if (h >= 12 + 8) {
                setHour(h - 12)
            }
        }
    }

    return (
        <div className={`time-picker${dropped ? " open" : ""}`}>
            <input
                type="text"
                readOnly
                className="time-picker__input"
                value={selectedTime ? genTime(selectedTime) : ""}
                placeholder="--:--"
                onClick={() => setDropped((d) => !d)}
            />

            <div className="time-picker__popover">
                <div className="time-picker__lists">
                    {/* HOURS */}
                    <div
                        className="time-picker__list"
                        ref={hoursRef}
                        onScroll={(e) => infiniteScroll(e, hoursList.length)}
                    >
                        {[...hoursList, ...hoursList, ...hoursList].map((p, idx) => {
                            const val = genHour(p.start);
                            return (
                                <button
                                    key={`h-${val}-${idx}`}
                                    className={hour === val ? "selected" : ""}
                                    onClick={() => setHour(val)}
                                    type="button"
                                >
                                    {val === 12 ? 12 : val % 12}
                                </button>
                            );
                        })}

                    </div>
                    
                    {/* MINUTES */}
                    <div
                        className="time-picker__list"
                        ref={minutesRef}
                        onScroll={(e) => infiniteScroll(e, minuteList.length)}
                    >
                        {[...minuteList, ...minuteList, ...minuteList].map((m, idx) => (
                            <button
                                key={`m-${m}-${idx}`}
                                className={minute === m ? "selected" : ""}
                                onClick={() => setMinute(m)}
                                type="button"
                            >
                                {m}
                            </button>
                        ))}
                    </div>

                    {/* AM/PM */}
                    <div
                        className="time-picker__list"
                    >
                        {["AM", "PM"].map((label, idx) => (
                            <button
                                key={`amp-${label}-${idx}`}
                                className={PM === (label === "PM") ? "selected" : ""}
                                onClick={() => handleSetPM(label === "PM")}
                                type="button"
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
