export interface RepoInterface<T>{
    create(data: T) : Promise<T | Error>;
    findOne(id: string): Promise<T | Error>;
    find(skip : number, limit : number): Promise<T[] | Error>;
    update(data: T) : Promise<{success: boolean}>;
    delete(id: string): Promise<{success: boolean}>;
}