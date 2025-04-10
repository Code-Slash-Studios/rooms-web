import https from "https";
import fetch from "node-fetch";
import { User } from "~/models/auth";

const httpsAgent = new https.Agent({
    rejectUnauthorized: false
});

export async function getOrCreateUser(user: User) {
    return fetch(
        `${process.env.API_URL}/reservation/${user.id}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user),
            agent: httpsAgent,
        }
        ).then((response) => {
            return response.json().then((json) => {
                return ;
            })
        }
    ).catch((error) => {console.error(error); return undefined});
}