import { UserRepository } from "../repository/Users/UserRepository"
import { ChatHistoryRepository } from "../repository/ChatHistory/ChatHistoryRepository"
import { Message } from "../../shared/Models/Message/Message";
import { ServerState } from "../state/ServerState";
import { Server, Socket } from "socket.io";
import { MongoClient } from "mongodb";
import { v4 as uuidv4 } from 'uuid';
import { UserLogInPayload, UserLogOutPayload } from "../../shared/Payloads/UserEventPayloads";
import { User } from "../../shared/Models/User/User";


/**
 * This is a class for separating out server code from routing code in index.ts
 */
export class ServerClient {

    private io: Server;
    private state: ServerState;

    private userrepository: UserRepository;
    private chathistoryrepository: ChatHistoryRepository;

    constructor(io: Server) {
        this.io = io;
        this.setupClient();


        MongoClient.connect('mongodb://mongodb')
            .then((result: MongoClient) => {
                const db = result.db('Baxochat');

                this.userrepository = new UserRepository(db);
                this.chathistoryrepository = new ChatHistoryRepository(db)

                this.userrepository.resetActiveUsers();
            });


    }

    public async CheckUserExists(username): Promise<Boolean> {
        return await this.userrepository.readIsUsernameInUse(username);
    }


    private setupClient() {
        this.io.on('connection', async (socket: Socket) => {
            let username = socket.handshake.query.username.toString();


            console.log(`${username} has connected`);

            let user: User = await this.userrepository.readUserByUsername(username);

            if (!user) {
                return;
            }

            user.activeDevices++;
            await this.userrepository.update(user);

            let allUsers = await this.userrepository.readAll();

            let payload: UserLogInPayload =
            {
                username: username,
                message: `${user.username} has joined the chat`,
                onlineUsers: allUsers.filter(user => user.activeDevices > 0).map(user => user.username) ?? [],
                offlineUsers: allUsers.filter(user => user.activeDevices <= 0).map(user => user.username) ?? []
            }

            this.io.emit("user_join", payload);

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

            user.activeDevices--;

            await this.userrepository.update(user);

            let connectedUsers = await this.userrepository.readAllUsernames();

            let allUsers = await this.userrepository.readAll();

            let payload: UserLogOutPayload =
            {
                username: username,
                message: `${user.username} has joined the chat`,
                onlineUsers: allUsers.filter(user => user.activeDevices > 0).map(user => user.username) ?? [],
                offlineUsers: allUsers.filter(user => user.activeDevices <= 0).map(user => user.username) ?? []
            }

            this.io.emit('user_leave', payload);
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
