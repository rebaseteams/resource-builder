import { Connection, Repository } from "typeorm";
import { GenericInterface } from "../interfaces";

export class GenericRepo<T> implements GenericInterface<T>{
    private repository: Repository<T>
    private type: string

    constructor(connection: Connection, type: string) {
      this.repository = connection.getRepository(type);
      this.type = type
      }
        async create(data: T): Promise<T> {
          const resp = await this.repository.save(data)
          if(resp) return data
          const err = { message: `Cannot create ${this.type}`, statusCode: 404 };
          throw err;
        }

        async findOne(id: string): Promise<T> {
          const item = await this.repository.findOne(id) as T;
          if(item) return item;
          const err = { message: `${this.type} not found for id: ${id}`, statusCode: 404 };
          throw err;
        }

        async find(skip : number, limit : number): Promise<T[]> {
          const items: T[] = await this.repository.find({
            take: limit,
            skip,
          });
          if(items.length) return items;
          const err = { message: `${this.type}s not found`, statusCode: 404 };
          throw err;
        }

        async update(data: T): Promise<{ success: boolean }> {
          const resp = await this.repository.save(data)
          if(resp) return { success: true }
          const err = { message: `Cannot update ${this.type}`, statusCode: 404 };
          throw err;
        }

        async delete(id: string): Promise<{success: boolean}> {
          const resp =this.repository.delete(id);
          const affected = (await resp).affected
          if(affected && affected > 0)
          return { success: true };
          const err = { message: `Cannot delete ${this.type} for id: ${id}`, statusCode: 404 };
          throw err;
        }

}