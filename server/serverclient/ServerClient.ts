import { UserRepository } from "../repository/Users/UserRepository"
import { ChatHistoryRepository } from "../repository/ChatHistory/ChatHistoryRepository"
import { Message } from "../../shared/Models/Message/Message";
import { ServerState } from "../state/ServerState";
import { Socket } from "socket.io";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { User } from "../../shared/Models/User/User";



export class ServerClient {

    private io: Socket;
    private state: ServerState;

    private userrepository: UserRepository;
    private chathistoryrepository: ChatHistoryRepository;

    constructor(io: Socket, serverState: ServerState) {
        this.io = io;
        this.state = serverState;
        this.setupClient();


        MongoClient.connect('mongodb://localhost:27017')
            .then((result: MongoClient) => {
                const db = result.db('Baxochat');

                this.userrepository = new UserRepository(db);
                this.chathistoryrepository = new ChatHistoryRepository(db)
            });
    }

    public async CheckUserExists(username): Promise<Boolean> {
        return await this.userrepository.readIsUsernameInUse(username);
    }


    private setupClient() {
        this.io.on('connection', async (socket: Socket) => {
            let username = socket.handshake.query.username.toString();


            console.log(`${username} has connected`);

            let usernameAlreadyExists = await this.userrepository.readIsUsernameInUse(username)

            if (usernameAlreadyExists) {
                return;
            }

            let user = new User(username);

            let userId = await this.userrepository.create(user);

            let connectedUsers = await this.userrepository.readAllUsernames();

            let data = {
                username: user.username,
                text: `${user.username} has joined the chat`,
                connectedusers: connectedUsers
            };

            this.io.emit("user_join", data);

            var messages = await this.chathistoryrepository.readAll();

            socket.emit("load_chat", messages)

            this.setupSocketEventHandlers(socket);
        });
    }



    private setupSocketEventHandlers(socket: Socket) {

        //receive message
        socket.on("chat_message", async (msg) => {
            if (msg.text.length >= 200) return null;

            let messageId: string = uuidv4();
            var newMessage = new Message(
                msg.username,
                msg.text,
                new Date()
            );

            var id = await this.chathistoryrepository.create(newMessage);

            //TEST CODE
            this.chathistoryrepository.read(id);

            socket.broadcast.emit("chat_message", msg);
            this.io.emit("users_finished_typing", msg.username);
        });


        //user disconnected
        socket.on('disconnect', async () => {

            let username = socket.handshake.query.username.toString();
            console.log(`${username} has disconnected`);

            let user = await this.userrepository.readUserByUsername(username);

            await this.userrepository.delete(user);

            let data = {
                username: username,
                text: `${username} has left the chat`,
                connectedusers: await this.userrepository.readAllUsernames()
            };

            this.io.emit('user_leave', data);
        });


        //user is typing
        socket.on('user_typing', async (username) => {
            /*
                        let user = await this.userrepository.readUserByUsername(username);
            
                        this.state.SetIsUserTyping(user);
            
                        console.log(`${username} is typing`);
            
                        let users_typing = this.state.GetUsersTyping();
            
                        let users_typing_usernames = users_typing.map(user => { return user.username });
            
                        this.io.emit('users_typing', users_typing_usernames);

            */
        });
    }
}
