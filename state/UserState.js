"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserState = void 0;
//create a user state object.
var User_1 = require("./User");
//contains multiple users
var UserState = /** @class */ (function () {
    function UserState() {
        var _this = this;
        this.toString = function () {
            return "All Users: \r\n\r\n" + _this.users;
        };
        this.ids = [];
        this.users = [];
    }
    UserState.prototype.GetUser = function (id) {
        return this.users[this.ids.indexOf(id)];
    };
    UserState.prototype.GetUserByUserName = function (username) {
        var user = this.users.filter(function (user) {
            return user.username === username;
        })[0];
        return user;
    };
    UserState.prototype.GetAllUsers = function () {
        return this.users;
    };
    UserState.prototype.GetUsers = function (ids) {
        var _this = this;
        var indexes = ids.filter(function (id) {
            if (_this.ids.indexOf(id) !== -1)
                return _this.ids.indexOf(id);
        });
        return indexes.map(function (index) {
            return _this.users[index];
        });
    };
    UserState.prototype.GetAllUsernames = function () {
        return this.users.map(function (user) { return user.username; });
    };
    UserState.prototype.CreateUser = function (username, socket) {
        var user = new User_1.User(username, socket);
        this.ids = this.ids.concat(socket.id);
        this.users = this.users.concat(user);
        return user;
    };
    UserState.prototype.RemoveUserByName = function (username) {
        var user = this.users.filter(function (user) {
            return user.username === username;
        })[0];
        var index = this.users.indexOf(user);
        this.ids.splice(index, 1);
        this.users.splice(index, 1);
        return true;
    };
    UserState.prototype.RemoveUserBySocketId = function (socketId) {
        var index = this.ids.indexOf(socketId);
        this.ids.splice(index, 1);
        this.users.splice(index, 1);
        return true;
    };
    UserState.prototype.GetUserExistsByUsername = function (username) {
        var user = this.users.filter(function (user) {
            return user.username === username;
        })[0];
        return (user != null);
    };
    UserState.prototype.GetUserExistsBySocketId = function (socketId) {
        return this.ids.indexOf(socketId) !== -1;
    };
    return UserState;
}());
exports.UserState = UserState;
//# sourceMappingURL=UserState.js.map