import { MicrosoftProfile, MicrosoftStrategy } from "remix-auth-microsoft";
import { Authenticator } from "remix-auth";
import { User } from "~/models/auth";


export let authenticator = new Authenticator<MicrosoftProfile>(); //User is a custom user types you can define as you want

let microsoftStrategy = new MicrosoftStrategy(
  {
    clientId: "6b863eae-d882-4d70-89b9-67abd3bc1c6e",
    clientSecret: process.env.REACT_APP_MSAL_SECRET!,
    tenantId: "57cc97f0-039b-48f4-80a1-f40341889c0b",
    redirectURI: "http://cisrooms.stvincent.edu/login/sso-complete",
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
    console.log(profile)
    return profile;
  }
);

authenticator.use(microsoftStrategy, "msal");