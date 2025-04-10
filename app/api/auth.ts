import { User } from "~/models/auth";

export async function getOrCreateUser(user: User) {
    return fetch(
        `${process.env.API_URL}/reservation/${user.id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return ;
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}