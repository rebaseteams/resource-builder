import { FindManyOptions } from "typeorm";

export interface RepoInterface<T>{
    create(data: T) : Promise<T>;
    findOne(id: string): Promise<T>;
    find(filters?: FindManyOptions<T>): Promise<T[]>;
    update(data: T) : Promise<{success: boolean}>;
    delete(id: string): Promise<{success: boolean}>;
}
