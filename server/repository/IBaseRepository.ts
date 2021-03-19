

export interface IBaseRepository<T> {
    create(item: T): Promise<Boolean>;
    update(item: T): Promise<Boolean>;
    delete(item: T): Promise<Boolean>;

    read(id: string): Promise<T>;
    readAll(): Promise<T[]>;
}