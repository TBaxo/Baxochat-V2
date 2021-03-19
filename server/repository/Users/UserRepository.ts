import { BaseRepository } from "../BaseRepository";
import { IUserRepository } from "./IUserRepository"
import { User } from "../../../shared/Models/User/User"
import { Db } from 'mongodb';


const collectionname = 'user';
export class UserRepository extends BaseRepository<User> implements IUserRepository {

    constructor(db: Db) {
        super(db, collectionname)
    }
}