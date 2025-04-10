import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session";

export const action = async ({ request } : { request: Request }) => {
    let url = new URL(request.url);
    let code = url.searchParams.get("code");
    console.log(url)
    if (!code) {
        throw new Response("Missing Authorization code", { status: 403 });
    }
    const tokenParams = new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        scope: "openid profile email",
        code: code,
        redirect_uri: "http://cisrooms.stvincent.edu/login/sso-complete",
        grant_type: "authorization_code",
        client_secret: process.env.CLIENT_SECRET!,
    })

    let tokenResponse = await fetch(
        `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/token`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: tokenParams.toString(),
        }
    )
    //https://learn.microsoft.com/en-us/windows/windows-app-sdk/api/winrt/microsoft.security.authentication.oauth.tokenresponse?view=windows-app-sdk-1.7
    let tokenData = await tokenResponse.json();
    
    if (tokenResponse.status !== 200) {
        console.error(tokenData);
        console.error(tokenResponse.statusText);
        throw new Response(`403: Error getting token ${tokenResponse.statusText}`, { status: 403 });
    }

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    
    session.set("user", {
        openid: tokenData.openid,
        profile: tokenData.profile,
        email: tokenData.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        idToken: tokenData.id_token,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
    });
    console.log({
        openid: tokenData.openid,
        profile: tokenData.profile,
        email: tokenData.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        idToken: tokenData.id_token,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
    })
    return redirect("/", {headers: {"Set-Cookie": await sessionStorage.commitSession(session)}});
}

export const loader = async ({ request } : { request: Request }) => {
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    if (user) {
        return redirect("/");
    }
    return {user}
}

export function SSOComplete() {
    return <p>Processing authentication... (If you are seeing this, something has probably gone wrong :)</p>
}