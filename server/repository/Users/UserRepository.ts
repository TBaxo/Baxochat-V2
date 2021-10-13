import { BaseRepository } from "../BaseRepository";
import { IUserRepository } from "./IUserRepository"
import { User } from "../../../shared/Models/User/User"
import { Db } from 'mongodb';


const collectionname = 'user';
export class UserRepository extends BaseRepository<User> implements IUserRepository {

    constructor(db: Db) {
        super(db, collectionname);
    }

    public async readUserByUsername(username: string): Promise<User> {
        const result = await this.collection.findOne({ username: username });

        return result;
    }

    public async readAllUsernames(): Promise<string[]> {
        const projection = { _id: 0, username: 1 };

        const result = (await this.collection.find({}).project(projection).toArray()).map((user) => user.username);

        return result;
    }

    public async readIsUsernameInUse(username: string): Promise<boolean> {
        const result = await this.collection.countDocuments({ username: username }, { limit: 1 });

        return result >= 1;
    }


}