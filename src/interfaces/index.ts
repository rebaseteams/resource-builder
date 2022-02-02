export interface RepoInterface<T>{
    create(data: T) : Promise<T>;
    findOne(id: string): Promise<T>;
    find(skip : number, limit : number): Promise<T[]>;
    update(data: T) : Promise<{success: boolean}>;
    delete(id: string): Promise<{success: boolean}>;
}