import { User, SessionUser } from "~/models/auth";
import { getRequestUser } from "~/services/auth";


export async function getUserWithID(userID: string, request: Request) {
    //get user from request
    const actor = getRequestUser(request)
    console.log("Actor", actor, "Requested user", userID)
    return fetch(
        `${process.env.API_URL}/users/${userID}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
        ).then((response) => {
            return response.json().then((json) => {
                console.log("User found", json);
                return json;
            })
        }).catch((error) => {
            console.error(error);
            return undefined;
        });
}
//used for login of user
export async function newUserInstance(user: SessionUser) {
    return fetch(
        `${process.env.API_URL}/users/${user.id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }
        ).then((response) => {
            if (response.status === 404 || response.status === 500) {
                throw new Error(response.statusText)
            }
            return response.json().then((json) => {
                console.log("User found");
                return User.fromJSON(json);
            })
        }).catch((error) => {
            console.error("Failed: to get user, try create");
            console.log("User not found, creating new user", user.id);
            //try to create the user
            return fetch(
                `${process.env.API_URL}/users`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(User.fromSessionUser(user).toJSON()),
                }
            ).then(async (response) => {
                if (response.status === 404 || response.status === 500) {
                    console.log("Failed to create user", response.statusText)
                    //decode body
                    throw new Error(await response.bytes().then((bytes) => {
                        const decoder = new TextDecoder("utf-8");
                        return decoder.decode(bytes);
                    }))
                }
                return response.json().then((json) => {
                    console.log("User created", json);
                    return User.fromJSON(json);
                })
            }).catch(

            )
        }
    );
}