import { BaseRepository } from "../BaseRepository";
import { IChatHistoryRepository } from "./IChatHistoryRepository"
import { Message } from "../../../shared/Models/Message/Message"
import { Db } from 'mongodb';

const collectionname = 'chathistory';
export class ChatHistoryRepository extends BaseRepository<Message> implements IChatHistoryRepository {

    constructor(db: Db) {
        super(db, collectionname)
    }
}