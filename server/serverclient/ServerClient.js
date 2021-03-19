"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerClient = void 0;
var UserRepository_1 = require("../repository/Users/UserRepository");
var ChatHistoryRepository_1 = require("../repository/ChatHistory/ChatHistoryRepository");
var Message_1 = require("../../shared/Models/Message/Message");
var mongodb_1 = require("mongodb");
var uuid_1 = require("uuid");
var ServerClient = /** @class */ (function () {
    function ServerClient(io, serverState) {
        var _this = this;
        this.io = io;
        this.state = serverState;
        this.setupClient();
        mongodb_1.MongoClient.connect('mongodb://localhost:27017')
            .then(function (result) {
            var db = result.db('Baxochat');
            _this.userrepository = new UserRepository_1.UserRepository(db);
            _this.chathistoryrepository = new ChatHistoryRepository_1.ChatHistoryRepository(db);
        });
    }
    ServerClient.prototype.setupClient = function () {
        var _this = this;
        this.io.on('connection', function (socket) {
            var username = socket.handshake.query.username.toString();
            console.log(username + " has connected");
            var userState = _this.state.GetUserState();
            if (!userState.GetUserExistsByUsername(username)) {
                var newUser = userState.CreateUser(username, socket);
                var data = {
                    username: newUser.username,
                    text: newUser.username + " has joined the chat",
                    connectedusers: userState.GetAllUsernames()
                };
                _this.io.emit("user_join", data);
                _this.setupSocketEventHandlers(socket);
            }
        });
    };
    ServerClient.prototype.setupSocketEventHandlers = function (socket) {
        var _this = this;
        //receive message
        socket.on("chat_message", function (msg) {
            if (msg.text.length >= 200)
                return null;
            var messageId = uuid_1.v4();
            var newMessage = new Message_1.Message(messageId, socket.id, msg.text, new Date());
            _this.chathistoryrepository.create(newMessage);
            socket.broadcast.emit("chat_message", msg);
            _this.io.emit("users_finished_typing", msg.username);
        });
        //user disconnected
        socket.on('disconnect', function () {
            var userState = _this.state.GetUserState();
            var disconnectedUser = userState.GetUser(socket.id);
            console.log(disconnectedUser.username + " has disconnected");
            userState.RemoveUserBySocketId(socket.id);
            var data = {
                username: disconnectedUser.username,
                text: disconnectedUser.username + " has left the chat",
                connectedusers: userState.GetAllUsernames()
            };
            _this.io.emit('user_leave', data);
        });
        //user is typing
        socket.on('user_typing', function (username) {
            var userState = _this.state.GetUserState();
            var user = userState.GetUserByUserName(username);
            _this.state.SetIsUserTyping(user);
            console.log(username + " is typing");
            var users_typing = _this.state.GetUsersTyping();
            var users_typing_usernames = users_typing.map(function (user) { return user.username; });
            _this.io.emit('users_typing', users_typing_usernames);
        });
    };
    return ServerClient;
}());
exports.ServerClient = ServerClient;
//# sourceMappingURL=ServerClient.js.map