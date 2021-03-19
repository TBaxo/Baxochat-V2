export class Message {
    public id: string;
    public userid: string;
    public text: string;
    public datecreated: Date;


    constructor(id: string, userid: string, text: string, datecreated: Date) {
        this.id = id;
        this.userid = userid;
        this.text = text;
        this.datecreated = datecreated;
    }
}

