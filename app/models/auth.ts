export interface SessionUser {
    id: string,
    firstName: string,
    lastName: string,
    name: string,
    username: string,
    isAdmin: boolean,
    email: string,
    idToken: any,
    authenticated: number,
    expiresAt: number,
}

export class User {
    id: string;
    name: string;
    email: string;
    idToken: any;
    expiresAt: number;

    constructor(user: SessionUser) {
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.idToken = user.idToken;
        this.expiresAt = user.expiresAt;
    }
}