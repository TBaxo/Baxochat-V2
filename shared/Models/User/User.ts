export class User {

    public id: string;
    public username: string;
    public socket: any;


    constructor(username: string, socket: any) {
        this.id = socket.id;
        this.username = username;
        this.socket = socket;
    }

    public toString = (): string => {
        return `Id: ${this.id} \r\nUsername: ${this.username} \r\n`;
    };
}

