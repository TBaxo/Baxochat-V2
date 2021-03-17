"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerState = void 0;
var UserState_1 = require("./UserState");
var TIMER_LENGTH = 5000;
var ServerState = /** @class */ (function () {
    function ServerState(socket) {
        this.socket = socket;
        this.userState = new UserState_1.UserState();
        this.timerIds = [];
        this.timers = [];
    }
    ServerState.prototype.GetUserState = function () {
        return this.userState;
    };
    ServerState.prototype.IsUserTyping = function (user) {
        return this.timerIds.indexOf(user.id) !== -1;
    };
    ServerState.prototype.GetUsersTyping = function () {
        var _this = this;
        var users = this.userState.GetAllUsers();
        return users.filter(function (user) {
            return _this.IsUserTyping(user);
        });
    };
    ServerState.prototype.SetIsUserTyping = function (user) {
        if (this.IsUserTyping(user)) {
            this.ResetTimer(user);
            return false;
        }
        var timer = this.SetTimer(user);
        this.timerIds.push(user.id);
        this.timers.push(timer);
        return true;
    };
    ServerState.prototype.ResetTimer = function (user) {
        var timerIndex = this.timerIds.indexOf(user.id);
        var timer = this.timers[timerIndex];
        clearTimeout(timer);
        this.timers[timerIndex] = this.SetTimer(user);
    };
    ServerState.prototype.SetTimer = function (user) {
        var _this = this;
        return setTimeout(function () {
            console.log(user.username + " is no longer typing");
            var timerIndex = _this.timerIds.indexOf(user.id);
            var timer = _this.timers[timerIndex];
            clearTimeout(timer);
            delete _this.timerIds[timerIndex];
            delete _this.timers[timerIndex];
            var usernames = _this.GetUsersTyping().map(function (user) {
                return user.username;
            });
            _this.socket.emit('users_typing', usernames);
        }, TIMER_LENGTH);
    };
    ServerState.prototype.RemoveTimer = function (user) {
        var timerIndex = this.timerIds.indexOf(user.id);
        var timer = this.timers[timerIndex];
        clearTimeout(timer);
        delete this.timerIds[timerIndex];
        delete this.timers[timerIndex];
    };
    return ServerState;
}());
exports.ServerState = ServerState;
//# sourceMappingURL=ServerState.js.map