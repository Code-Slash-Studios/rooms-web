import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session";
import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";
import { SessionUser } from "~/models/auth";

export const action = async ({ request } : { request: Request }) => {
    //get nonce from session
    console.log("~~Login Request~~")
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const nonce = `CISRooms`
    if (!nonce) { //TODO: rolling nonces
        console.log("Nonce not found in session");
        return redirect("/login/error?e=nonce_not_found;d=Nonce not found in session;");
    }
    //get form data
    const formData = await request.formData();
    console.log(formData)
    //check for errors
    const error = formData.get("error") as string;
    if (error) {
        console.log("Error", error);
        return redirect("/login/error?e=" + error);
    }
    //decode token_id
    // see https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference for refrence of fields
    const encoded_token = formData.get("id_token") as string;
    const token = JSON.parse(atob(encoded_token.split(".")[1]));
    console.log("Login from", token.name, token.email, token.sub);
    //try to get user from API

    const user: SessionUser = {
        isAdmin: false,
        id: token.oid,
        firstName: token.name.split(", ")[1],
        lastName: token.name.split(", ")[0],
        name: token.name,
        username: token.prefered_username,
        email: token.email,
        idToken: token,
        authenticated: parseInt(token.iat),
        expiresAt: parseInt(token.exp),
    }
    session.set("user", user);
    console.log(user)
    return redirect("/", {headers: {"Set-Cookie": await sessionStorage.commitSession(session)}});
}    

export const loader = async ({ request } : { request: Request }) => {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user") || null;
    console.log("User", user);
    return { user };
}

export default function SSOComplete() {
    const {user} = useLoaderData<typeof loader>();
    useEffect(() => {
        if (user) {
            console.log("User already logged in", user);
            redirect("/");
        } else {
            console.log("User not logged in", user);
        }
    }, )
    return <p>Processing authentication... (If you are seeing this, something has probably gone wrong :)</p>
}