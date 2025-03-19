import { redirect } from "@remix-run/node"
import { authenticator } from "~/services/auth"

export const action = async ({ request } : { request: Request }) => {
    let user = await authenticator.authenticate("msal", request);
    let session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.set("user", user);
    throw redirect("/", {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
        },
    });
}

export async function loader({ request }: { request: Request }) {
    //check if the user is already authenicated?
    let session = await sessionStorage.getSession(request.headers.get("Cookie"));
    let user = session.get("user");
    if (user) {
        throw redirect("/");
    }
    return {};
}