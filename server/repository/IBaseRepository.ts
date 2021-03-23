import { ObjectId } from "mongodb";


export interface IBaseRepository<T> {
    create(item: T): Promise<ObjectId>;
    update(item: T): Promise<Boolean>;
    delete(item: T): Promise<Boolean>;

    read(id: ObjectId): Promise<T>;
    readAll(): Promise<T[]>;
}