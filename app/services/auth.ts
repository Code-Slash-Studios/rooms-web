import { redirect } from "@remix-run/react";
import { sessionStorage } from "./session";

export let loginRequired = async (request:Request) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // Check if user is logged in and the token is not expired
  if (!user || user.expiresAt < Date.now()) {
    throw redirect("/login/sso-out");
  }
  return user;
}