import {
    Links,
    Meta,
    Outlet,
    Scripts,
    useLoaderData,
  } from "@remix-run/react";
import Navbar from "./components/Navbar";
import "./style.css";
import "./favicon.ico";
import { sessionStorage } from "./services/session";
import { getRequestUser } from "./services/auth";
import { useEffect, useState } from "react";
import { SessionUser } from "./models/auth";
import { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async ({ request }: { request: Request }) => {
    //load user from session
    const user = await getRequestUser(request)
    console.log("Path", request.url.slice(request.url.indexOf(":80") + 5, request.url.length));
    return { userData: user };
}

export default function App() {
  const {userData} = useLoaderData<typeof loader>()

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
        <Navbar user={userData}/>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
  }