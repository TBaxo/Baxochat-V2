import { ObjectId } from "bson";

export class User {

    public _id: ObjectId;
    public username: string;


    constructor(username: string) {
        this.username = username;
    }

    public toString = (): string => {
        return `Id: ${this._id} \r\nUsername: ${this.username} \r\n`;
    };
}

