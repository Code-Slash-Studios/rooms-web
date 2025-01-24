export async function getAll() {
    return JSON.stringify([
        {
            title: "Event 1",
            room: "W210",
            start: new Date(),
            end: new Date()
        },
        {
            title: "Event 2",
            room: "W212",
            start: new Date(),
            end: new Date()
        }
    ]);
}
export async function getById(id: string) {
    return JSON.stringify({
        title: "Event 1",
        room: "W210",
    });
}