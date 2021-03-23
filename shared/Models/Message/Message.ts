import { ObjectId } from "bson";

export class Message {
    public _id: ObjectId;
    public userid: string;
    public text: string;
    public datecreated: Date;


    constructor(userid: string, text: string, datecreated: Date) {
        this.userid = userid;
        this.text = text;
        this.datecreated = datecreated;
    }
}

