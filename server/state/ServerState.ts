import { User } from "../../shared/Models/User/User";
import { Socket } from "socket.io";

const TIMER_LENGTH: number = 5000;

export class ServerState {
    private socket: Socket;

    private timerIds: Array<string>;
    private timers: Array<any>;

    constructor(socket: Socket) {
        this.socket = socket;

        this.timerIds = [];
        this.timers = [];
    }


    public IsUserTyping(user: User): boolean {
        return this.timerIds.indexOf(user.socket.) !== -1;
    }

    public GetUsersTyping(): Array<User> {
        let users = this.userState.GetAllUsers();
        return users.filter(user => {
            return this.IsUserTyping(user);
        });
    }

    public SetIsUserTyping(user: User) {
        if (this.IsUserTyping(user)) {
            this.ResetTimer(user);
            return false;
        }

        let timer = this.SetTimer(user);
        this.timerIds.push(user.username);
        this.timers.push(timer);
        return true;
    }


    private ResetTimer(user: User) {
        let timerIndex = this.timerIds.indexOf(user.socket)
        let timer = this.timers[timerIndex];
        clearTimeout(timer);
        this.timers[timerIndex] = this.SetTimer(user);
    }

    private SetTimer(user: User) {
        return setTimeout(() => {
            console.log(`${user.username} is no longer typing`);

            let timerIndex = this.timerIds.indexOf(user.id)
            let timer = this.timers[timerIndex];
            clearTimeout(timer);

            delete this.timerIds[timerIndex];
            delete this.timers[timerIndex];

            let usernames = this.GetUsersTyping().map((user) => {
                return user.username;
            });

            this.socket.emit('users_typing', usernames);
        }, TIMER_LENGTH)
    }

    private RemoveTimer(user: User) {
        let timerIndex = this.timerIds.indexOf(user.id)
        let timer = this.timers[timerIndex];
        clearTimeout(timer);

        delete this.timerIds[timerIndex];
        delete this.timers[timerIndex];
    }
}