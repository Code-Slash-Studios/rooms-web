import { Link } from "@remix-run/react";
import "./Navbar.css";

export default function() {
    return <nav className="navbar">
        <ul className="navbar-links">
            <li><Link to="/">Rooms</Link></li>
            <li><Link to="/reservations">Reservations</Link></li>
            <li><Link to="/login/sso-out">login</Link></li>
        </ul>
    </nav>
}