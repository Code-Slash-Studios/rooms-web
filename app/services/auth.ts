import { redirect } from "@remix-run/react";
import { sessionStorage } from "./session";

export let loginRequired = async (request:Request) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // Check if user is logged in and the token is not expired
  if (!user || user.expiresAt < Date.now()) {
    console.log("User not logged in or token expired", request.headers.get("x-forwarded-for") || "");
    throw redirect("/login/sso-out");
  }
  return user;
}