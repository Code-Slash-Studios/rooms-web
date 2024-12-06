import {
    Links,
    Meta,
    Outlet,
    Scripts,
  } from "@remix-run/react";
import Navbar from "./components/Navbar";
  
  export default function App() {
    return (
      <html>
        <head>
          <link
            rel="icon"
            href="data:image/x-icon;base64,AA"
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