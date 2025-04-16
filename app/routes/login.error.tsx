import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";


export const loader = async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const error = url.searchParams.get("e");
    const errorMessage = url.searchParams.get("d");
    return { error, errorMessage };
}

export default function LoginError() {
    const { error, errorMessage } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>Login Error</h1>
            {error && <p>Error: {error}</p>}
            {errorMessage && <p>Message: {errorMessage}</p>}
            <p>Please try again.</p>
            <p>If the problem persists, please contact support.</p>
            <a href="/">Back to Home</a>
        </div>
    );
}