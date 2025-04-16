export interface SessionUser {
    openid: string,
    profile: string,
    email: string,
    accessToken: string,
    refreshToken: string,
    idToken: string,
    expiresAt: string,
}

export class User {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    idToken: string;
    expiresAt: number;

    constructor(user: SessionUser) {
        this.id = user.id;
        this.name = user.profile;
        this.email = user.email;
        this.accessToken = user.accessToken;
        this.refreshToken = user.refreshToken;
        this.idToken = user.idToken;
        this.expiresAt = parseInt(user.expiresAt);
    }
}