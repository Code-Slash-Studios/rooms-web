import { ClientLoaderFunctionArgs, Link, redirect, useLoaderData } from "@remix-run/react";
import "./Navbar.css";
import { useState } from "react";
import { SessionUser } from "~/models/auth";
import { signout } from "~/services/auth";

// export const loader = async ({request}: ClientLoaderFunctionArgs) => {
//     //load user from session
//     const session = await sessionStorage.getSession(request.headers.get("Cookie"));
//     const user = session.get("user") || "";
//     return { "user": user, "placeholder": "" };
// }

interface NavbarProps {
    user: SessionUser | undefined
}

export default function Navbar({user}: NavbarProps) {
    const [dropped, setDrop] = useState(false)
    return <nav className="navbar">
        <div className="navbar-logo">
            <Link to="/"><img alt="CIS Rooms" src="/CISRooms.png"></img></Link>
        </div>
        <ul className="navbar-links">
            <li key="rooms_link"><Link to="/">Rooms</Link></li>
            {/* <li key="reservations_link"><Link to="/reservations">Reservations</Link></li> */}
            {(user && <li key="welcome" onClick={()=>setDrop(!dropped)}>Welcome {user.firstName}!<a className={"userdrop"+ (dropped? " dropped" : "")} href="/logout">Signout</a></li>) || (<li key="login_link"><Link to="/login/sso-out">Login</Link></li>)}
        </ul>
    </nav>
}