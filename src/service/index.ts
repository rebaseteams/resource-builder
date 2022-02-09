import { FindManyOptions } from "typeorm";
import { RepoInterface } from "../interfaces";

export class BaseTypeORMService<T> implements RepoInterface<T>{
    private repo: RepoInterface<T>;

    constructor(repo: RepoInterface<T>){
        this.repo = repo
    }

    async create(data: T): Promise<T | Error> {
        return this.repo.create(data);
    }

    async findOne(id: string): Promise<T | Error> {
        return this.repo.findOne(id);
    }

    async find(filters?: FindManyOptions<T>): Promise<Error | T[]> {
        return this.repo.find(filters);
    }

    async update(data: T): Promise<{ success: boolean; } | Error> {
        return this.repo.update(data);
    }

    async delete(id: string): Promise<Error | { success: boolean; }> {
        return this.repo.delete(id)
    }
}