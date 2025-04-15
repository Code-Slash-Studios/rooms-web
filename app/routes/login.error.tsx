import { ClientLoaderFunctionArgs, useLoaderData } from "@remix-run/react";


export const loader = async ({ request }: ClientLoaderFunctionArgs) => {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");
    return { error };
}

export default function LoginError() {
    const { error } = useLoaderData<typeof loader>();
    return (
        <div>
            <h1>Login Error</h1>
            {error && <p>Error: {error}</p>}
        </div>
    );
}