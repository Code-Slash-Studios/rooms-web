export interface SessionUser {
    openid: string,
    profile: string,
    email: string,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    expiresAt: string,
}