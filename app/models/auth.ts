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
    isAdmin: boolean = false;

    constructor(id: string, firstName: string, lastName: string, isAdmin: boolean = false) {
        this.isAdmin = isAdmin;
        this.id = id;
        this.name = `${lastName}, ${firstName}`
        this.firstName = firstName;
        this.lastName = lastName;
    }
    static empty = () => new User("", "", "");
    static fromJSON(json: any) {
        //for processing single user
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        //check if the parsed json is an array
        if (Array.isArray(json)) {
            throw new Error("Expected a single user object, but got an array");
        }
        return new User(json.id, json.fname, json.lname, json.isAdmin);
    }
    static fromSessionUser(user: SessionUser) {
        return new User(user.id, user.firstName, user.lastName, user.isAdmin);
    }
    toJSON() {
        return {
            id: this.id,
            fname: this.firstName,
            lname: this.lastName,
            isAdmin: this.isAdmin,
        };
    }
}