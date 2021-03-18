import { ServerState } from "../state/ServerState"
import { Socket } from "socket.io"

export class ServerClient {

    private io: Socket;
    private state: ServerState;

    constructor(io2: Socket, serverState: ServerState) {
        this.io = io2;
        this.state = serverState;

        this.setupClient();
    }


    private setupClient() {
        this.io.on('connection', (socket: Socket) => {
            let username = socket.handshake.query.username.toString();
            console.log(`${username} has connected`);

            let userState = this.state.GetUserState();

            if (!userState.GetUserExistsByUsername(username)) {

                let newUser = userState.CreateUser(username, socket);

                let data = {
                    username: newUser.username,
                    text: `${newUser.username} has joined the chat`,
                    connectedusers: userState.GetAllUsernames()
                };

                this.io.emit("user_join", data);

                this.setupSocketEventHandlers(socket);
            }
        });
    }



    private setupSocketEventHandlers(socket: Socket) {

        //receive message
        socket.on("chat_message", (msg) => {
            if (msg.text.length >= 200) return null;

            socket.broadcast.emit("chat_message", msg);
            this.io.emit("users_finished_typing", msg.username);
        });


        //user disconnected
        socket.on('disconnect', () => {
            let userState = this.state.GetUserState();

            let disconnectedUser = userState.GetUser(socket.id);
            console.log(`${disconnectedUser.username} has disconnected`);

            userState.RemoveUserBySocketId(socket.id);

            let data = {
                username: disconnectedUser.username,
                text: `${disconnectedUser.username} has left the chat`,
                connectedusers: userState.GetAllUsernames()
            };

            this.io.emit('user_leave', data);
        });


        //user is typing
        socket.on('user_typing', (username) => {

            let userState = this.state.GetUserState();

            let user = userState.GetUserByUserName(username);

            this.state.SetIsUserTyping(user);

            console.log(`${username} is typing`);

            let users_typing = this.state.GetUsersTyping();

            let users_typing_usernames = users_typing.map(user => { return user.username });

            this.io.emit('users_typing', users_typing_usernames);
        });
    }
}
