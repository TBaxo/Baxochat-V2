import { User } from "./User";
import { UserState } from "./UserState";

const TIMER_LENGTH: number = 5000;

export class ServerState {
    private userState: UserState;

    private timerIds: Array<string>;
    private timers: Array<any>;

    constructor() {
        this.userState = new UserState();

        this.timerIds = [];
        this.timers = [];
    }

    public GetUserState() {
        return this.userState;
    }

    public UserIsTyping(user: User): boolean {
        return this.timerIds.indexOf(user.id) !== -1;
    }

    public GetUsersTyping(): Array<User> {
        let users = this.userState.GetAllUsers();
        return users.filter(user => {
            return this.UserIsTyping(user);
        });
    }

    public SetUserIsTyping(user: User) {
        if (this.UserIsTyping(user)) {
            this.ResetTimer(user);
            return false;
        }

        let timer = this.SetTimer(user);
        this.timerIds.push(user.id);
        this.timers.push(timer);
        return true;
    }


    private ResetTimer(user: User) {
        let timerIndex = this.timerIds.indexOf(user.id)
        let timer = this.timers[timerIndex];
        clearTimeout(timer);
        this.timers[timerIndex] = this.SetTimer(user);
    }

    private SetTimer(user: User) {
        return setTimeout(() => {
            console.log(`${username} is no longer typing`);
            delete users_typing[socketId];

            let usernames = Object.keys(users_typing).map((key) => {
                return users_typing[key].username;
            });

            .emit('users_typing', usernames);
        }, TIMER_LENGTH)
    }

    private RemoveTimer(user: User) {

    }
}