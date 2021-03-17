"use strict";
exports.__esModule = true;
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username, socket) {
        var _this = this;
        //
        this.toString = function () {
            return "Id: " + _this.id + " \r\nUsername: " + _this.username + " \r\n";
        };
        this.id = socket.id;
        this.username = username;
        this.socket = socket;
        this.isTyping = false;
    }
    return User;
}());
exports.User = User;
