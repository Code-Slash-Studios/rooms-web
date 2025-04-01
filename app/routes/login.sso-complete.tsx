import { redirect } from "@remix-run/node";
import { sessionStorage } from "~/services/session";

export const action = async ({ request } : { request: Request }) => {
    let url = new URL(request.url);
    let code = url.searchParams.get("code");

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
    let tokenData = await tokenResponse.json();
    
    if (tokenResponse.status !== 200) {
        throw new Response("Error getting token", { status: 403 });
    }

    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    
    session.set("user", {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        idToken: tokenData.id_token,
        expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return redirect("/", {headers: {"Set-Cookie": await sessionStorage.commitSession(session)}});
}

export async function SSOComplete() {
    return <p>Processing authentication...</p>
}