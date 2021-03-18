"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username, socket) {
        var _this = this;
        this.toString = function () {
            return "Id: " + _this.id + " \r\nUsername: " + _this.username + " \r\n";
        };
        this.id = socket.id;
        this.username = username;
        this.socket = socket;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map