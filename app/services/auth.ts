import { redirect } from "@remix-run/react";
import { sessionStorage } from "./session";

export let loginRequired = async (request:Request) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // Check if user is logged in and the token is not expired
  if (user === undefined) {
    console.log("User not logged in");
    return redirect("/login/sso-out");
  }
  if (user.expiresAt < Date.now()) {
    console.log("Token expired");
    return redirect("/login/error?e=token_expired&d=Token expired;");
  }
  return user || "";
}