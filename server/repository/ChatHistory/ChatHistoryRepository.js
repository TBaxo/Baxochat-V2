"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatHistoryRepository = void 0;
var BaseRepository_1 = require("../BaseRepository");
var collectionname = 'chathistory';
var ChatHistoryRepository = /** @class */ (function (_super) {
    __extends(ChatHistoryRepository, _super);
    function ChatHistoryRepository(db) {
        return _super.call(this, db, collectionname) || this;
    }
    return ChatHistoryRepository;
}(BaseRepository_1.BaseRepository));
exports.ChatHistoryRepository = ChatHistoryRepository;
//# sourceMappingURL=ChatHistoryRepository.js.map