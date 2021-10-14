import { ObjectId } from "bson";

export class User {

    public _id: ObjectId;
    public username: string;
    public activeDevices: number;

    constructor(username: string) {
        this.username = username;
        this.activeDevices = 0;
    }

    public toString = (): string => {
        return `Id: ${this._id} \r\nUsername: ${this.username} \r\n`;
    };
}

