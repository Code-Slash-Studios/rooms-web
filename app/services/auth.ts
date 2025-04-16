import { redirect } from "@remix-run/react";
import { sessionStorage } from "./session";

export let loginRequired = async (request:Request) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // Check if user is logged in and the token is not expired
  if (user === undefined) {
    console.log("User not logged in");
    throw redirect("/login/sso-out");
  }
  if (user.expiresAt < Date.now()/1000) { //Date.now() returns milliseconds, token expiresAt is in seconds
    console.log(user, user.expiresAt, Date.now())
    console.log("Token expired");
    throw redirect("/login/error?e=token_expired&d=Token expired;");
  }
  return user || "";
}