import { redirect } from "@remix-run/node";
import { ClientLoaderFunction } from "@remix-run/react";
import { sessionStorage } from "~/services/session";

// This is the login route for Microsoft SSO
// It redirects the user to the Microsoft login page
// See: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow

export const loader: ClientLoaderFunction = async ({request}) => {
    const nonce = Math.random().toString(36).substring(2, 15);
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        response_type: "code id_token",
        redirect_uri: process.env.REDIRECT_URI!,
        scope: "openid profile email",
        response_mode: "form_post",
        nonce: "CISRooms",// SHOULD BE CHECKED ?? NOT CHECKED FOR TESTING PURPOSES
    })
    //unset user from session
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    session.unset("user");
    //set nonce to session
    session.set("nonce", nonce);
    //set state to session
    return redirect(
        `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/authorize?${params.toString()}`,
        {
            headers: {
                "Set-Cookie": await sessionStorage.commitSession(session),
            }
        }
    );
};

export default function Login() {
    return <h1>Redirecting...</h1>
}