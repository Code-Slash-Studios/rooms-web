import { redirect } from "@remix-run/node";

// This is the login route for Microsoft SSO
// It redirects the user to the Microsoft login page
// See: https://learn.microsoft.com/en-us/entra/identity-platform/v2-oauth2-auth-code-flow

export let loader = () => {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        response_type: "code id_token",
        redirect_uri: process.env.REDIRECT_URI!,
        scope: "openid profile email",
        response_mode: "form_post",
        nonce: `${Math.random()}`, // This should be a unique value for each request // SHOULD BE CHECKED ?? NOT CHECKED FOR TESTING PURPOSES
    })

    return redirect(
        `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/authorize?${params.toString()}`
    );
};

export default function Login() {
    return <h1>Redirecting...</h1>
}