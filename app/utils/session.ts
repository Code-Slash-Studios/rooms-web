import { redirect } from "@remix-run/node"
import { sessionStorage } from "~/services/session"

export async function requireUser(request: Request) {
    let session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    if (!user) {
        return redirect("/login/sso-out");
    }
    return user;
}