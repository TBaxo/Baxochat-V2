"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerClient = void 0;
var UserRepository_1 = require("../repository/Users/UserRepository");
var ChatHistoryRepository_1 = require("../repository/ChatHistory/ChatHistoryRepository");
var Message_1 = require("../../shared/Models/Message/Message");
var mongodb_1 = require("mongodb");
var uuid_1 = require("uuid");
/**
 *This is a thing
 */
var ServerClient = /** @class */ (function () {
    function ServerClient(io) {
        var _this = this;
        this.io = io;
        this.setupClient();
        mongodb_1.MongoClient.connect('mongodb://localhost:27017')
            .then(function (result) {
            var db = result.db('Baxochat');
            _this.userrepository = new UserRepository_1.UserRepository(db);
            _this.chathistoryrepository = new ChatHistoryRepository_1.ChatHistoryRepository(db);
            _this.userrepository.resetActiveUsers();
        });
    }
    ServerClient.prototype.CheckUserExists = function (username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.userrepository.readIsUsernameInUse(username)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    ServerClient.prototype.setupClient = function () {
        var _this = this;
        this.io.on('connection', function (socket) { return __awaiter(_this, void 0, void 0, function () {
            var username, user, allUsers, payload, messages;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        username = socket.handshake.query.username.toString();
                        console.log(username + " has connected");
                        return [4 /*yield*/, this.userrepository.readUserByUsername(username)];
                    case 1:
                        user = _c.sent();
                        if (!user) {
                            return [2 /*return*/];
                        }
                        user.activeDevices++;
                        return [4 /*yield*/, this.userrepository.update(user)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.userrepository.readAll()];
                    case 3:
                        allUsers = _c.sent();
                        payload = {
                            username: username,
                            message: user.username + " has joined the chat",
                            onlineUsers: (_a = allUsers.filter(function (user) { return user.activeDevices > 0; }).map(function (user) { return user.username; })) !== null && _a !== void 0 ? _a : [],
                            offlineUsers: (_b = allUsers.filter(function (user) { return user.activeDevices <= 0; }).map(function (user) { return user.username; })) !== null && _b !== void 0 ? _b : []
                        };
                        this.io.emit("user_join", payload);
                        return [4 /*yield*/, this.chathistoryrepository.readAll()];
                    case 4:
                        messages = _c.sent();
                        socket.emit("load_chat", messages);
                        this.setupSocketEventHandlers(socket);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    ServerClient.prototype.setupSocketEventHandlers = function (socket) {
        var _this = this;
        //receive message
        socket.on("chat_message", function (msg) { return __awaiter(_this, void 0, void 0, function () {
            var messageId, newMessage, id;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (msg.text.length >= 200)
                            return [2 /*return*/, null];
                        messageId = (0, uuid_1.v4)();
                        newMessage = new Message_1.Message(msg.username, msg.text, new Date());
                        return [4 /*yield*/, this.chathistoryrepository.create(newMessage)];
                    case 1:
                        id = _a.sent();
                        //TEST CODE
                        this.chathistoryrepository.read(id);
                        socket.broadcast.emit("chat_message", msg);
                        this.io.emit("users_finished_typing", msg.username);
                        return [2 /*return*/];
                }
            });
        }); });
        //user disconnected
        socket.on('disconnect', function () { return __awaiter(_this, void 0, void 0, function () {
            var username, user, connectedUsers, allUsers, payload;
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        username = socket.handshake.query.username.toString();
                        console.log(username + " has disconnected");
                        return [4 /*yield*/, this.userrepository.readUserByUsername(username)];
                    case 1:
                        user = _c.sent();
                        user.activeDevices--;
                        return [4 /*yield*/, this.userrepository.update(user)];
                    case 2:
                        _c.sent();
                        return [4 /*yield*/, this.userrepository.readAllUsernames()];
                    case 3:
                        connectedUsers = _c.sent();
                        return [4 /*yield*/, this.userrepository.readAll()];
                    case 4:
                        allUsers = _c.sent();
                        payload = {
                            username: username,
                            message: user.username + " has joined the chat",
                            onlineUsers: (_a = allUsers.filter(function (user) { return user.activeDevices > 0; }).map(function (user) { return user.username; })) !== null && _a !== void 0 ? _a : [],
                            offlineUsers: (_b = allUsers.filter(function (user) { return user.activeDevices <= 0; }).map(function (user) { return user.username; })) !== null && _b !== void 0 ? _b : []
                        };
                        this.io.emit('user_leave', payload);
                        return [2 /*return*/];
                }
            });
        }); });
        //user is typing
        socket.on('user_typing', function (username) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/];
            });
        }); });
    };
    return ServerClient;
}());
exports.ServerClient = ServerClient;
//# sourceMappingURL=ServerClient.js.map