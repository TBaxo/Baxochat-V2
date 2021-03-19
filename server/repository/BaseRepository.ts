import { IBaseRepository } from "./IBaseRepository"
import { Db, Collection, InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject } from 'mongodb';

export abstract class BaseRepository<T> implements IBaseRepository<T> {

    private readonly collection: Collection

    constructor(db: Db, collectionname: string) {
        this.collection = db.collection(collectionname);
    }

    async create(item: T): Promise<Boolean> {
        const result: InsertOneWriteOpResult<any> = await this.collection.insertOne(item);

        return !result.result.ok;
    }
    async update(item: T): Promise<Boolean> {
        const result: UpdateWriteOpResult = await this.collection.updateOne({}, item);

        return !result.result.ok;
    }
    async delete(item: T): Promise<Boolean> {
        const result: DeleteWriteOpResultObject = await this.collection.deleteOne({}, item);

        return !result.result.ok;
    }
    async read(id: string): Promise<T> {
        const result: Promise<T> = this.collection.findOne({});

        return result;
    }
    async readAll(): Promise<T[]> {
        const result: Promise<T[]> = this.collection.find({}).toArray();

        return result;
    }
}
