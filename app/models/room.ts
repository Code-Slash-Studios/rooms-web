export class Room {
    id: number;
    name: string;
    department: string;
    constructor(id?:number, name?: string, department?: string) {
        this.id = id || -1;
        this.name = name || "";
        this.department = department || "";
    }
    static empty = () => new Room(-1, "", "");
    
    isEmpty() {
        return this.id == -1 && this.name == "" && this.department == "";
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
}