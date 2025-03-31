import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
import Navbar from "./components/Navbar";
import "./style.css";
import "./favicon.ico";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="icon"
          href="./favicon.ico"
        />
        <Meta />
        <Links />
      </head>
      <body>
        <h1>CIS Rooms - Hello world!</h1>
        <Navbar />
        <Outlet />

        <Scripts />
      </body>
    </html>
  );
  }