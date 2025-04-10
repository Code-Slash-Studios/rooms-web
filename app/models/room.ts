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

    static fromJSON(json: {id:string, name:string, department:string} | string): Room {
        //for processing single room
        if (typeof json === "string") {
            const parse = JSON.parse(json);
            //check if the parsed json is an array
            if (Array.isArray(parse)) {
                throw new Error("Expected a single room object, but got an array");
            }
            if (!parse.id || !parse.name || !parse.department) {
                throw new Error("Invalid room data");
            }
            const data: {id:string, name:string, department:string} = parse;
            json = data;
        }
        return new Room(json.id, json.name, json.department);
    }

    static factory(json: any): Room[] {
        //for processing multiple rooms
        const rooms = json.map((r: any) => {
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
}