export class Room {
    id: string;
    name: string;
    department: string;
    constructor(id:string, name: string, department: string) {
        this.id = id;
        this.name = name;
        this.department = department;
    }
    static empty = () => new Room("", "", "");
    
    isEmpty() {
        return this.id == "" && this.name == "" && this.department == "";
    }

    static fromJSON(json: any | string | {id: string, name:string, department:string}): Room {
        //for processing single room
        if (typeof json === "string") {
            json = JSON.parse(json);
        }
        //check if the parsed json is an array
        if (Array.isArray(json)) {
            throw new Error("Expected a single room object, but got an array");
        }
        this.validateObject(json)
        return new Room(json.id, json.name, json.department);
    }

    static factory(json: any[]): Room[] {
        //for processing multiple rooms
        console.log("RoomsFactory", json);
        const rooms = json.map((r: any) => {
            if (typeof r === "string") {
                r = JSON.parse(r);
            }
            if (!r.id || !r.name || !r.department) {
                throw new Error("Invalid room data");
            }
            return new Room(r.id, r.name, r.department);
        })
        return rooms;
    }
    toJSON() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            department: this.department
        });
    }
    static validateObject(json: any) {
        if (typeof json !== "object" || json === null) {
            throw new Error("Invalid room data: not an object");
        }
        if (!json.id || !json.name || !json.department) {
            throw new Error("Invalid room data: missing fields");
        }
    }
}