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

export function SessionUserFromJSON(json: any): SessionUser {
    //for processing single user
    if (typeof json === "string") {
        json = JSON.parse(json);
    }
    //check if the parsed json is an array
    if (Array.isArray(json)) {
        throw new Error("Expected a single user object, but got an array");
    }
    return {
        id: json.oid,
        firstName: json.name.split(", ")[1],
        lastName: json.name.split(", ")[0],
        name: json.name,
        username: json.preferred_username,
        isAdmin: json.isAdmin,
        email: json.email,
        idToken: json.idToken,
        authenticated: parseInt(json.authenticated),
        expiresAt: parseInt(json.expiresAt),
    };
}


export class User {
    id: string;
    firstName: string;
    lastName: string;
    name: string;

    constructor(id: string, firstName: string, lastName: string, name: string) {
        this.id = id;
        this.name = name;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    static empty = () => new User("", "", "", "");
    static fromJSON(json: any) {
        //for processing single user
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        //check if the parsed json is an array
        if (Array.isArray(json)) {
            throw new Error("Expected a single user object, but got an array");
        }
        return new User(json.id, json.fname, json.lname, json.name);
    }
    static fromSessionUser(user: SessionUser) {
        return new User(user.id, user.firstName, user.lastName, user.name);
    }
    toJSON() {
        return {
            id: this.id,
            fname: this.firstName,
            lname: this.lastName,
            name: this.name,
        };
    }
}