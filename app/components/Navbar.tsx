import { ClientLoaderFunctionArgs, Link, useLoaderData } from "@remix-run/react";
import "./Navbar.css";

export const loader = async ({request}: ClientLoaderFunctionArgs) => {
    //load user from session
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user") || "";
    return { "user": user };
}

export default function Navbar() {
    const { user } = useLoaderData<any>();
    let userData = {name: ""};
    if (user !== "") {
        userData = JSON.parse(user);
    }
    return <nav className="navbar">
        <div className="navbar-logo">
            <Link to="/"><img alt="CIS Rooms" src="/CISRooms.png"></img></Link>
        </div>
        <ul className="navbar-links">
            <li key="rooms_link"><Link to="/">Rooms</Link></li>
            <li key="reservations_link"><Link to="/reservations">Reservations</Link></li>
            {(user && <li key="welcome">Welcome {userData.name}</li>) || (<li key="login_link"><Link to="/login/sso-out">Login</Link></li>)}
        </ul>
    </nav>
}