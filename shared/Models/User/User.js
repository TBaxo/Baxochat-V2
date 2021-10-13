"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var User = /** @class */ (function () {
    function User(username) {
        var _this = this;
        this.toString = function () {
            return "Id: " + _this._id + " \r\nUsername: " + _this.username + " \r\n";
        };
        this.username = username;
    }
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map