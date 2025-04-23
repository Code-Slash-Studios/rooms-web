

export const action = async ({request}: {request: Request}) => {
    const cookieHeader = request.headers.get("Cookie") || "";
    const session = await sessionStorage.getSession(cookieHeader);
    session.unset("user");
    return new Response(null, {
        status: 302,
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
            Location: "/",
        },
    });
}
export const loader = async ({request}: {request: Request}) => {
    console.log("signout")
    const cookieHeader = request.headers.get("Cookie") || "";
    const session = await sessionStorage.getSession(cookieHeader);
    session.unset("user");
    console.log("signout")
    throw new Response(null, {
        status: 302,
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session),
            Location: "/",
        },
    });
}
export default function Logout() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">Logging out...</h1>
            <p className="mt-4">You will be redirected shortly.</p>
        </div>
    );
}