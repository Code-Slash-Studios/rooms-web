import { redirect } from "@remix-run/node";

// This is the login route for Microsoft SSO
// It redirects the user to the Microsoft login page

export let loader = () => {
    const params = new URLSearchParams({
        client_id: process.env.CLIENT_ID!,
        response_type: "code",
        redirect_uri: process.env.REDIRECT_URI!,
        scope: " email",
        response_mode: "query",
    })

    return redirect(
        `https://login.microsoftonline.com/${process.env.TENANT_ID!}/oauth2/v2.0/authorize?${params.toString()}`
    );
};

export default function Login() {
    return <h1>Redirecting...</h1>
}