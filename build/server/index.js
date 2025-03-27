var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@remix-run/node";
import { RemixServer, Meta, Links, Outlet, Scripts, Link, Form, useLoaderData } from "@remix-run/react";
import * as isbotModule from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { useState, useEffect } from "react";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  let prohibitOutOfOrderStreaming = isBotRequest(request.headers.get("user-agent")) || remixContext.isSpaMode;
  return prohibitOutOfOrderStreaming ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function isBotRequest(userAgent) {
  if (!userAgent) {
    return false;
  }
  if ("isbot" in isbotModule && typeof isbotModule.isbot === "function") {
    return isbotModule.isbot(userAgent);
  }
  if ("default" in isbotModule && typeof isbotModule.default === "function") {
    return isbotModule.default(userAgent);
  }
  return false;
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
function Navbar() {
  return /* @__PURE__ */ jsx("nav", { className: "navbar", children: /* @__PURE__ */ jsx("ul", { className: "navbar-links", children: /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx("a", { href: "", children: "Rooms" }) }) }) });
}
function App() {
  return /* @__PURE__ */ jsxs("html", { children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx(
        "link",
        {
          rel: "icon",
          href: "./favicon.ico"
        }
      ),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx("h1", { children: "CIS Rooms - Hello world!" }),
      /* @__PURE__ */ jsx(Navbar, {}),
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App
}, Symbol.toStringTag, { value: "Module" }));
function toDatetimeLocal(date) {
  const pad = (num) => num.toString().padStart(2, "0");
  if (date == void 0) {
    return "";
  }
  date = new Date(date);
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
const rooms = [
  { id: 1, name: "W210", building: "Dupre", title: "W210" },
  { id: 2, name: "W212", building: "Dupre", title: "W212" },
  { id: 3, name: "WCC", building: "Dupre", title: "CIS Conference Room" }
];
function getRooms() {
  return Array.from(rooms.values());
}
function getRoom(id) {
  console.log(id);
  return rooms.find((value) => value.name === id);
}
const _Reservation = class _Reservation {
  constructor(id, title, roomID, room, start, end) {
    __publicField(this, "id");
    __publicField(this, "title");
    __publicField(this, "roomID");
    __publicField(this, "room");
    __publicField(this, "start");
    __publicField(this, "end");
    this.id = id;
    this.title = title;
    this.roomID = roomID;
    this.room = room;
    this.start = start;
    this.end = end;
  }
  static factory(json) {
    if (json == null) {
      return null;
    }
    if (typeof json == "string") {
      json = JSON.parse(json);
      if (!json.title || !json.room || !json.start || !json.end) {
        throw new Error("Invalid JSON: missing required fields");
      }
    }
    if (Array.isArray(json)) {
      return json.map((r) => {
        return _Reservation.factory(r);
      });
    } else {
      return new _Reservation(json.id, json.title, json.room_id, json.room, new Date(json.start), new Date(json.end));
    }
  }
  toString() {
    return `${this.title} in ${this.room} from ${this.start.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })} to ${this.end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  }
  render() {
    return /* @__PURE__ */ jsx(ReservationComp, { id: this.id, title: this.title, room: this.room, start: this.start, end: this.end });
  }
  isValid() {
    let valid = true;
    if (this.title == "") {
      valid = false;
    }
    if (this.roomID == -1) {
      valid = false;
    }
    if (this.start == null) {
      valid = false;
    }
    if (this.end == null) {
      valid = false;
    }
    if (this.start >= this.end) {
      valid = false;
    }
    return valid;
  }
};
__publicField(_Reservation, "empty", () => new _Reservation(-1, "", -1, "", /* @__PURE__ */ new Date(), /* @__PURE__ */ new Date()));
let Reservation = _Reservation;
const ReservationComp = (props2, timeOnly2 = false) => {
  if (timeOnly2) {
    var start = props2.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    var end = props2.end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } else {
    var start = props2.start.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric", year: "numeric" });
    var end = props2.end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric", year: "numeric" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "event", children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      /* @__PURE__ */ jsx("u", { children: props2.title }),
      " in ",
      props2.room
    ] }, "title"),
    /* @__PURE__ */ jsxs("h2", { children: [
      start,
      " - ",
      end
    ] }, "time"),
    /* @__PURE__ */ jsx(Link, { to: `/reservation/${props2.id}`, children: /* @__PURE__ */ jsx("button", { children: "Details" }) }),
    /* @__PURE__ */ jsx(Link, { to: `/reservation/${props2.id}/edit`, children: /* @__PURE__ */ jsx("button", { children: "Edit" }) })
  ] }, "{props.title}");
};
const ReservationFormComp = (props2) => {
  return /* @__PURE__ */ jsxs(Form, { method: "PUT", onChange: props2.onChange, onSubmit: props2.onSubmit, className: "reservationForm", children: [
    /* @__PURE__ */ jsx("input", { title: "title", name: "title", type: "text", defaultValue: props2.title }),
    /* @__PURE__ */ jsxs("select", { title: "room", name: "room", defaultValue: props2.roomID, children: [
      /* @__PURE__ */ jsx("option", { value: -1, children: "Select a room" }),
      Array.from(getRooms().entries()).map(([id, room]) => /* @__PURE__ */ jsx("option", { value: id, children: room }, id))
    ] }),
    /* @__PURE__ */ jsx("input", { title: "start", name: "start", type: "datetime-local", defaultValue: toDatetimeLocal(props2.start) }),
    /* @__PURE__ */ jsx("input", { title: "end", name: "end", type: "datetime-local", defaultValue: toDatetimeLocal(props2.end) }),
    /* @__PURE__ */ jsx("button", { type: "submit", children: "Submit" })
  ] });
};
const url = "https://de5349bd-1628-4ca3-b667-05d25816b5e5.mock.pstmn.io";
async function getAll() {
  return fetch(
    `${url}/reservations`
  ).then(
    (response) => {
      return response.json().then((json) => {
        return json.map((r) => Reservation.factory(r));
      });
    }
  ).catch((error) => {
    console.error(error);
    return void 0;
  });
}
async function getById(id) {
  return fetch(
    `${url}/reservation/${id}`
  ).then(
    (response) => {
      return response.json().then((json) => {
        return Reservation.factory(json);
      });
    }
  ).catch((error) => {
    console.error(error);
    return void 0;
  });
}
async function post(reservation) {
  return fetch(
    `${url}/reservation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reservation)
    }
  ).then((response) => {
    return response.json();
  }).catch((error) => {
    console.error(error);
    return void 0;
  });
}
const loader$5 = async ({ params }) => {
  return { "reservationID": params.id };
};
function reservationDetail() {
  const { reservationID } = useLoaderData();
  const [reservation, setReservation] = useState(Reservation.empty());
  const [error, setError] = useState();
  useEffect(() => {
    getById(reservationID).then((res) => {
      if (res == void 0) {
        setError("No reservation found");
        console.error("No reservation found");
        return;
      }
      console.log(res);
      setReservation(res);
    });
  }, [reservationID]);
  if (timeOnly) {
    var start = props.start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    var end = props.end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  } else {
    var start = props.start.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric", year: "numeric" });
    var end = props.end.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", month: "short", day: "numeric", year: "numeric" });
  }
  return /* @__PURE__ */ jsxs("div", { className: "event", children: [
    /* @__PURE__ */ jsx("h1", { children: "Reservation Detail" }, "title1"),
    /* @__PURE__ */ jsxs("h1", { children: [
      /* @__PURE__ */ jsx("u", { children: props.title }),
      " in ",
      props.room
    ] }, "title"),
    /* @__PURE__ */ jsxs("h2", { children: [
      start,
      " - ",
      end
    ] }, "time")
  ] }, "{props.title}");
}
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: reservationDetail,
  loader: loader$5
}, Symbol.toStringTag, { value: "Module" }));
const loader$4 = async ({ params }) => {
  return getById(params.id).then((res) => {
    if (res == void 0) {
      console.error("No reservation found");
      return { "reservation": void 0, "getError": "No reservation found" };
    }
    return { "reservation": res, "getError": void 0 };
  });
};
function EditReservation$1() {
  const { reservation, getError } = useLoaderData();
  const [title, setTitle] = useState("");
  const [roomID, setRoomID] = useState(-1);
  const [start, setStart] = useState(/* @__PURE__ */ new Date());
  const [end, setEnd] = useState(/* @__PURE__ */ new Date());
  useEffect(() => {
    if (reservation != void 0) {
      setTitle(reservation.title);
      setRoomID(reservation.roomID);
      setStart(reservation.start);
      setEnd(reservation.end);
    }
  }, [reservation]);
  const handleChange = (event) => {
    switch (event.target.title) {
      case "title":
        setTitle(event.target.value);
        break;
      case "room":
        setRoomID(event.target.value);
        break;
      case "start":
        if (event.target.value > end) {
          setEnd(start);
        }
        setStart(event.target.value);
        break;
      case "end":
        if (event.target.value < start) {
          setEnd(start);
        }
        setEnd(event.target.value);
        break;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title, getRoom(roomID), start, end);
    if (!reservation) {
      console.error("No reservation found");
      return;
    }
    let save = new Reservation(reservation.id, title, roomID, getRoom(roomID), start, end);
    if (save.isValid()) {
      post(save).then((res) => {
        alert(res);
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Edit Reservation" }, "title"),
    /* @__PURE__ */ jsx(ReservationFormComp, { title, roomID, start, end, onChange: handleChange, onSubmit: handleSubmit })
  ] });
}
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EditReservation$1,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const loader$3 = async ({ params }) => {
  const roomID = params.rid;
  const room = await getRoom(roomID);
  return { "room": room };
};
const MILLIS_IN_DAY = 864e5;
function ScheduleRoom() {
  const { room } = useLoaderData();
  const currentDate = /* @__PURE__ */ new Date();
  currentDate.setHours(0, 0, 0, 0);
  const [selectedDate, setSelectedDate] = useState(/* @__PURE__ */ new Date());
  const [weekStart, setWeekStart] = useState(new Date(selectedDate.getTime() - selectedDate.getDay() * MILLIS_IN_DAY));
  let currentWeek = Array.from({ length: 7 }, (v, i) => {
    const date = new Date(weekStart.getTime() + i * MILLIS_IN_DAY);
    return { "past": date.getTime() < currentDate.getTime(), "date": date };
  });
  let endOfWeek = new Date(weekStart.getTime() + 6 * MILLIS_IN_DAY);
  const inThePast = endOfWeek < currentDate;
  const isEndOfMonth = weekStart.getMonth() != endOfWeek.getMonth();
  const isEndOfYear = weekStart.getFullYear() != endOfWeek.getFullYear();
  const selectDate = (date) => {
    setSelectedDate(date);
  };
  const backWeek = () => {
    setWeekStart(new Date(weekStart.getTime() - 7 * MILLIS_IN_DAY));
  };
  const nextWeek = () => {
    setWeekStart(new Date(weekStart.getTime() + 7 * MILLIS_IN_DAY));
  };
  if (!room || room === void 0) {
    console.log(room);
    return /* @__PURE__ */ jsx("main", { children: /* @__PURE__ */ jsx("div", { children: "Room not found" }) });
  }
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("main", { children: [
    /* @__PURE__ */ jsxs("h2", { children: [
      room.building,
      " - ",
      room.name
    ] }),
    /* @__PURE__ */ jsx("p", { children: "Select a date, choose a time slot, and select the duration of your reservation." }),
    /* @__PURE__ */ jsxs("p", { children: [
      "After choosing a day and time, enter your details below to reserve ",
      room.building,
      "-",
      room.name,
      "."
    ] }),
    /* @__PURE__ */ jsxs("p", { children: [
      "Please include the reason you are reserving the room.",
      /* @__PURE__ */ jsx("br", {}),
      "(ex. Studying for CS-330, Software Engineering group work, Senior Project meeting)"
    ] }),
    /* @__PURE__ */ jsx("div", { className: "scheduler", children: /* @__PURE__ */ jsxs("div", { className: "calendar-container", children: [
      /* @__PURE__ */ jsxs("div", { className: "calendar", children: [
        /* @__PURE__ */ jsxs("div", { className: "calendar-header " + (inThePast ? "past" : ""), children: [
          /* @__PURE__ */ jsx("button", { className: "prev", onClick: (e) => backWeek(), children: "❮" }),
          /* @__PURE__ */ jsxs("span", { id: "calendar-week", children: [
            "Week of ",
            weekStart.toLocaleDateString("en-US", { "month": "long", "day": "numeric", "year": isEndOfYear ? "numeric" : void 0 }),
            " - ",
            endOfWeek.toLocaleDateString("en-US", { "month": isEndOfMonth ? "long" : void 0, "day": "numeric", "year": isEndOfYear ? "numeric" : void 0 })
          ] }),
          /* @__PURE__ */ jsx("button", { className: "next", onClick: (e) => nextWeek(), children: "❯" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "calendar-grid", id: "calendar-days", children: currentWeek.map(({ past, date }) => {
          return /* @__PURE__ */ jsx("div", { className: "calendar-day " + (past ? "past" : ""), "data-date": date.toISOString(), onClick: (e) => selectDate(date), children: date.toLocaleDateString("en-US", { month: "short", day: "2-digit" }) });
        }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "time-slots-container", children: [
        /* @__PURE__ */ jsx("h4", { children: "Available Time Slots:" }),
        /* @__PURE__ */ jsx("div", { id: "time-slots" })
      ] })
    ] }) })
  ] }) });
}
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: ScheduleRoom,
  loader: loader$3
}, Symbol.toStringTag, { value: "Module" }));
function EditReservation() {
  const [title, setTitle] = useState("");
  const [roomID, setRoomID] = useState(-1);
  const [start, setStart] = useState(/* @__PURE__ */ new Date());
  const [end, setEnd] = useState(/* @__PURE__ */ new Date());
  const handleChange = (event) => {
    switch (event.target.title) {
      case "title":
        setTitle(event.target.value);
        break;
      case "room":
        setRoomID(event.target.value);
        break;
      case "start":
        if (event.target.value > end) {
          setEnd(start);
        }
        setStart(event.target.value);
        break;
      case "end":
        if (event.target.value < start) {
          setEnd(start);
        }
        setEnd(event.target.value);
        break;
    }
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(title, getRoom(roomID), start, end);
    let save = new Reservation(-1, title, roomID, getRoom(roomID), start, end);
    if (save.isValid()) {
      post(save).then((res) => {
        alert(res);
      });
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h1", { children: "Create Reservation" }, "title"),
    /* @__PURE__ */ jsx(ReservationFormComp, { title, roomID, start, end, onChange: handleChange, onSubmit: handleSubmit })
  ] });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: EditReservation
}, Symbol.toStringTag, { value: "Module" }));
const loader$2 = function() {
  let rooms2 = getRooms();
  return { "rooms": rooms2 };
};
function Rooms() {
  const { rooms: rooms2 } = useLoaderData();
  return /* @__PURE__ */ jsx("section", { className: "rooms", children: rooms2.map(
    (room) => /* @__PURE__ */ jsxs("div", { className: "room", children: [
      /* @__PURE__ */ jsxs("h2", { children: [
        "Dupre - ",
        room.title
      ] }),
      /* @__PURE__ */ jsx("p", { children: "Placeholder for status integration" }),
      /* @__PURE__ */ jsx("a", { href: "schedule/" + room.name, children: /* @__PURE__ */ jsx("button", { children: "Schedule" }) })
    ] }, room.id)
  ) });
}
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Rooms,
  loader: loader$2
}, Symbol.toStringTag, { value: "Module" }));
async function loader$1() {
  let rooms2 = getRooms();
  return { "rooms": rooms2 };
}
function Index() {
  return /* @__PURE__ */ jsx(Rooms, {});
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const loader = async ({ params }) => {
  return getAll().then((res) => {
    if (res == void 0) {
      console.error("No reservations found");
      return { "reservations": void 0, "getError": "No reservations found" };
    }
    return { "reservationData": res, "getError": void 0 };
  });
};
function Today() {
  const { reservationData, getError } = useLoaderData();
  const [reservations, setReservations] = useState(void 0);
  const time = /* @__PURE__ */ new Date();
  useEffect(() => {
    setReservations(Reservation.factory(reservationData));
  }, [reservationData]);
  console.log(reservations);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("h1", { children: [
      "Welcome to Today! ",
      time.toLocaleDateString("en-US", { month: "long", day: "numeric" })
    ] }, "title"),
    getError && /* @__PURE__ */ jsx("p", { children: getError }, "error"),
    /* @__PURE__ */ jsx("ul", { children: reservations != void 0 && reservations.map((r) => r.render()) }, "reservations")
  ] });
}
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Today,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-t_qNL47T.js", "imports": ["/assets/components-BAKIzCgY.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-CoDqz1ZI.js", "imports": ["/assets/components-BAKIzCgY.js"], "css": ["/assets/root-KneK9T77.css"] }, "routes/reservation.$id._index": { "id": "routes/reservation.$id._index", "parentId": "root", "path": "reservation/:id", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/reservation._id._index-CAFnVI8l.js", "imports": ["/assets/components-BAKIzCgY.js", "/assets/reservation-CkvKRGBo.js", "/assets/Reservation-BsaEhjMz.js"], "css": ["/assets/Reservation-DJ2_UoNI.css"] }, "routes/reservation.$id.edit": { "id": "routes/reservation.$id.edit", "parentId": "root", "path": "reservation/:id/edit", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/reservation._id.edit-CQwMKqsO.js", "imports": ["/assets/components-BAKIzCgY.js", "/assets/reservation-CkvKRGBo.js", "/assets/Reservation-BsaEhjMz.js"], "css": ["/assets/Reservation-DJ2_UoNI.css"] }, "routes/schedule.$rid._index": { "id": "routes/schedule.$rid._index", "parentId": "root", "path": "schedule/:rid", "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/schedule._rid._index-D37fMLt9.js", "imports": ["/assets/components-BAKIzCgY.js"], "css": [] }, "routes/reservation.create": { "id": "routes/reservation.create", "parentId": "root", "path": "reservation/create", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/reservation.create-Bv4ZuPPK.js", "imports": ["/assets/components-BAKIzCgY.js", "/assets/reservation-CkvKRGBo.js", "/assets/Reservation-BsaEhjMz.js"], "css": ["/assets/Reservation-DJ2_UoNI.css"] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-B8-BEU_7.js", "imports": ["/assets/components-BAKIzCgY.js", "/assets/rooms-CNSHIhmw.js"], "css": [] }, "routes/rooms": { "id": "routes/rooms", "parentId": "root", "path": "rooms", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/rooms-CNSHIhmw.js", "imports": ["/assets/components-BAKIzCgY.js"], "css": [] }, "routes/today": { "id": "routes/today", "parentId": "root", "path": "today", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/today-CD9h4zk5.js", "imports": ["/assets/components-BAKIzCgY.js", "/assets/Reservation-BsaEhjMz.js"], "css": ["/assets/Reservation-DJ2_UoNI.css"] } }, "url": "/assets/manifest-cbfa39ae.js", "version": "cbfa39ae" };
const mode = "production";
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "v3_fetcherPersist": false, "v3_relativeSplatPath": false, "v3_throwAbortReason": false, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/reservation.$id._index": {
    id: "routes/reservation.$id._index",
    parentId: "root",
    path: "reservation/:id",
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/reservation.$id.edit": {
    id: "routes/reservation.$id.edit",
    parentId: "root",
    path: "reservation/:id/edit",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/schedule.$rid._index": {
    id: "routes/schedule.$rid._index",
    parentId: "root",
    path: "schedule/:rid",
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/reservation.create": {
    id: "routes/reservation.create",
    parentId: "root",
    path: "reservation/create",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  },
  "routes/rooms": {
    id: "routes/rooms",
    parentId: "root",
    path: "rooms",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/today": {
    id: "routes/today",
    parentId: "root",
    path: "today",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
