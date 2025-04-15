import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session";
import { useEffect } from "react";
import { useLoaderData } from "@remix-run/react";

export const action = async ({ request } : { request: Request }) => {
    //get form data
    const formData = await request.formData();
    console.log("FormData", formData)
    console.log("Request",request)
    
    // if (tokenResponse.status !== 200) {
    //     console.error(tokenData);
    //     console.error(tokenResponse.statusText);
    //     throw new Response(`403: Error getting token ${tokenResponse.statusText}`, { status: 403 });
    // }

    // const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    
    // session.set("user", {
    //     openid: tokenData.openid,
    //     profile: tokenData.profile,
    //     email: tokenData.email,
    //     accessToken: tokenData.access_token,
    //     refreshToken: tokenData.refresh_token,
    //     idToken: tokenData.id_token,
    //     expiresAt: Date.now() + tokenData.expires_in * 1000,
    // });
    // console.log({
    //     openid: tokenData.openid,
    //     profile: tokenData.profile,
    //     email: tokenData.email,
    //     accessToken: tokenData.access_token,
    //     refreshToken: tokenData.refresh_token,
    //     idToken: tokenData.id_token,
    //     expiresAt: Date.now() + tokenData.expires_in * 1000,
    // })
    return redirect("/")
    //return redirect("/", {headers: {"Set-Cookie": await sessionStorage.commitSession(session)}});
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