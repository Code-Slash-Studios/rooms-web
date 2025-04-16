import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
import Navbar from "./components/Navbar";
import "./style.css";
import "./favicon.ico";
import { sessionStorage } from "./services/session";

export const loader = async ({ request }: { request: Request }) => {
    //load user from session
    const session = await sessionStorage.getSession(request.headers.get("Cookie"));
    const user = session.get("user") || "";
    console.log("Path", request.url.split("/", 2)[1]);
    return { "user": user };
}

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <Navbar />
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
  }