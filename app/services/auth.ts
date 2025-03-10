import { MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { User } from "~/models/auth";

export let authenticator = new Authenticator<string>(); //User is a custom user types you can define as you want

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: "YOUR_CLIENT_ID",
    clientSecret: "YOUR_CLIENT_SECRET",
    redirectURI: "https://example.com/auth/microsoft/callback",
    tenantId: "YOUR_TENANT_ID", // optional - necessary for organization without multitenant (see below)
    scopes: ["openid", "profile", "email"], // optional
    prompt: "login", // optional
  },
  async ({ request, tokens }) => {
    // Here you can fetch the user from database or return a user object based on profile
    let accessToken = tokens.accessToken();
    let idToken = tokens.idToken();
    let profile = await MicrosoftStrategy.userProfile(accessToken);

    // The returned object is stored in the session storage you are using by the authenticator

    // If you're using cookieSessionStorage, be aware that cookies have a size limit of 4kb

    // Retrieve or create user using id received from userinfo endpoint
    // https://graph.microsoft.com/oidc/userinfo

    // DO NOT USE EMAIL ADDRESS TO IDENTIFY USERS
    // The email address received from Microsoft Entra ID is not validated and can be changed to anything from Azure Portal.
    // If you use the email address to identify users and allow signing in from any tenant (`tenantId` is not set)
    // it opens up a possibility of spoofing users!

    return idToken;
  }
);

authenticator.use(microsoftStrategy, "msal");