export class Room {
    id: string;
    name: string;
    department: string;
    constructor(id?:string, name?: string, department?: string) {
        this.id = id || "";
        this.name = name || "";
        this.department = department || "";
    }
    static empty = () => new Room("", "", "");
    
    isEmpty() {
        return this.id == "" && this.name == "" && this.department == "";
    }
    
    static factory(json: any): Room {
        if (json == null) {
            return Room.empty();
        }
        
        if (typeof(json) == "string") {
            json = JSON.parse(json);
            if (!json.id || !json.name || !json.department) {
                throw new Error("Invalid JSON: missing required fields");
            }
        }
        return new Room(json.id, json.name, json.department);
    }
    toJSON() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            department: this.department
        });
    }
}