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
    if (process.env.NODE_ENV === "development" && process.env.LOCAL_ADMIN === "1") {
      console.log("Development mode, local admin enabled");
      return {"user":{
        id: "1",
        firstName: "Local",
        lastName: "Admin",
        name: "Local Admin",
        username: "localadmin@cisrooms.stvincent.edu",
        email: "localadmin@cisrooms.stvincent.edu",
        isAdmin: true,
        exp: 9999999999,
        authenticated: Date.now()/1000,
        token: {}
      }}
    }
    console.log("Path", request.url.slice(request.url.indexOf(":80") + 5, request.url.length));
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