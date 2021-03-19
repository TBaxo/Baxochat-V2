//create a user state object.
import { User } from "../../shared/Models/User/User";
//contains multiple users


export class UserState {
    private ids: Array<string>;
    private users: Array<User>;

    constructor() {
        this.ids = [];
        this.users = [];
    }

    public GetUser(id: string): User {
        return this.users[this.ids.indexOf(id)];
    }

    public GetUserByUserName(username: string): User {
        let user = this.users.filter((user) => {
            return user.username === username;
        })[0];

        return user;
    }

    public GetAllUsers(): Array<User> {
        return this.users;
    }

    public GetUsers(ids: Array<string>): Array<User> {
        let indexes = ids.filter((id) => {
            if (this.ids.indexOf(id) !== -1) return this.ids.indexOf(id);
        });

        return indexes.map((index) => {
            return this.users[index];
        });
    }

    public GetAllUsernames(): Array<string> {
        return this.users.map(user => { return user.username })
    }

    public CreateUser(username: string, socket: any): User {
        let user = new User(username, socket);

        this.ids = this.ids.concat(socket.id);
        this.users = this.users.concat(user);

        return user;
    }

    public RemoveUserByName(username: string): boolean {
        let user = this.users.filter((user) => {
            return user.username === username;
        })[0];

        let index = this.users.indexOf(user);

        this.ids.splice(index, 1);
        this.users.splice(index, 1);

        return true;
    }

    public RemoveUserBySocketId(socketId: string): boolean {
        let index = this.ids.indexOf(socketId);
        this.ids.splice(index, 1);
        this.users.splice(index, 1);
        return true;
    }

    public GetUserExistsByUsername(username: string): boolean {
        let user = this.users.filter((user) => {
            return user.username === username;
        })[0];

        return (user != null)
    }

    public GetUserExistsBySocketId(socketId: string): boolean {
        return this.ids.indexOf(socketId) !== -1;
    }

    public toString = (): string => {
        return `All Users: \r\n\r\n${this.users}`
    }
}
