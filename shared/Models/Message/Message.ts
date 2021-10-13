import { ObjectId } from "bson";

export class Message {
    public _id: ObjectId;
    public username: string;
    public text: string;
    public datecreated: Date;


    constructor(username: string, text: string, datecreated: Date) {
        this.username = username;
        this.text = text;
        this.datecreated = datecreated;
    }
}

