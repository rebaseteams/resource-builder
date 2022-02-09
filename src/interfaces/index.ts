import { FindManyOptions } from "typeorm";

export interface RepoInterface<T>{
    create(data: T) : Promise<T | Error>;
    findOne(id: string): Promise<T | Error>;
    find(filters?: FindManyOptions<T>): Promise<T[] | Error>;
    update(data: T) : Promise<{success: boolean}| Error>;
    delete(id: string): Promise<{success: boolean}| Error>;
}
