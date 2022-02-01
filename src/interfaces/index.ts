export interface GenericInterface<T>{
    // create(data: T) : Promise<T>;
    // find(item: T): Promise<T[]>;
    findOne(id: string): Promise<T>;
    // update(item: T) : Promise<T>;
    // delete(id: string): Promise<boolean>;
}