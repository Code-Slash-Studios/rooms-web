interface Room {
    id: number
    name: string
    building: string
    title: string
}
const rooms = [
    {id: 1, name: "W210", building: "Dupre", title:"W210"},
    {id: 2, name: "W212", building: "Dupre", title:"W212"},
    {id: 3, name: "WCC",  building: "Dupre", title:"CIS Conference Room"},
]
export function getRooms () {
    return Array.from(rooms.values())
}

export function getRoom (id: string) {
    return rooms.find((value) => value.name === id)
}