import { IBaseRepository } from "./IBaseRepository"
import { Db, Collection, InsertOneWriteOpResult, UpdateWriteOpResult, DeleteWriteOpResultObject, ObjectId } from 'mongodb';

export abstract class BaseRepository<T extends { _id: ObjectId }> implements IBaseRepository<T> {

    protected readonly collection: Collection

    constructor(db: Db, collectionname: string) {
        this.collection = db.collection(collectionname);
    }

    async create(item: T): Promise<ObjectId> {
        const result: InsertOneWriteOpResult<T> = await this.collection.insertOne(item);

        return result.insertedId;
    }
    async update(item: T): Promise<Boolean> {
        const result: UpdateWriteOpResult = await this.collection.replaceOne({ _id: item._id }, item);

        return !result.result.ok;
    }
    async delete(item: T): Promise<Boolean> {
        const result: DeleteWriteOpResultObject = await this.collection.deleteOne({}, item);

        return !result.result.ok;
    }
    async read(id: ObjectId): Promise<T> {
        const result: Promise<T> = this.collection.findOne({ _id: id });

        return result;
    }
    async readAll(): Promise<T[]> {
        const result: Promise<T[]> = this.collection.find({}).toArray();

        return result;
    }
}
