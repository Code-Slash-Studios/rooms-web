import { redirect } from "@remix-run/react";
import { sessionStorage } from "./session";

export let loginRequired = async (request:Request) => {
  const session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  // Check if user is logged in and the token is not expired
  if (process.env.NODE_ENV === "development" && process.env.LOCAL_ADMIN === "1") {
    if (!process.env.dev_notify){
      console.log("Development mode, local admin enabled");
    }
    process.env["dev_notify"] = "1"
    
    return {
      id: "1",
      firstName: "Local",
      lastName: "Admin",
      name: "Local Admin",
      username: "localadmin@cisrooms.stvincent.edu",
      email: "localadmin@cisrooms.stvincent.edu",
      isAdmin: true,
      exp: 9999999999,
      authenticated: Date.now()/1000,
      token: {

      }
  }}
  
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