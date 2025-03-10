import { User } from "~/models/auth";
import { apiURL } from "./config";

export async function getOrCreateUser(user: User) {
    return fetch(
        `${apiURL}/reservation/${user.id}`,
        ).then((response) => {
            return response.json().then((json) => {
                return ;
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}