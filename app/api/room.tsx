let rooms = new Map<number, string> ()
rooms.set(1, "W210")
rooms.set(2, "W211")
rooms.set(3, "W212")

export function getRooms () {
    return rooms
}

export function getRoom (id: number) {
    return rooms.get(id) || ""
}