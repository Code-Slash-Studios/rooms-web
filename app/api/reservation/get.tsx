export const url = "https://8a37a0ba-fb47-41c9-8862-8ae909b2a4ed.mock.pstmn.io"

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
    fetch(
        `${url}/reservation/${id}`
        ).then((response) => {
            
        }
    )
}