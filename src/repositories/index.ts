import { Connection, Repository } from "typeorm";
import { RepoInterface } from "../interfaces";

export class BaseTypeORMRepo<T> implements RepoInterface<T>{
    private repository: Repository<T>
    private resourceName: string

      constructor(connection: Connection, resourceName: string) {
      this.repository = connection.getRepository(resourceName);
      this.resourceName = resourceName
      }
        async create(data: T): Promise<T | Error> {
          let resp: Awaited<T>;
          try {
            resp = await this.repository.save(data)
            return resp;
          } catch (e) {
            const err: Error = {
              name: 'Create Resource Error',
              message: `Cannot create ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            return err;
          }
          
        }

        async findOne(id: string): Promise<T> {
          const item = await this.repository.findOne(id) as T;
          if(item) return item;
          const err = { message: `${this.resourceName} not found for id: ${id}` };
          throw err;
        }

        async find(skip : number, limit : number): Promise<T[]> {
          const items: T[] = await this.repository.find({
            take: limit,
            skip,
          });
          if(items.length) return items;
          const err = { message: `${this.resourceName}s not found` };
          throw err;
        }

        async update(data: T): Promise<{ success: boolean }> {
          const resp = await this.repository.save(data)
          if(resp) return { success: true }
          const err = { message: `Cannot update ${this.resourceName}` };
          throw err;
        }

        async delete(id: string): Promise<{success: boolean}> {
          const resp =this.repository.delete(id);
          const affected = (await resp).affected
          if(affected && affected > 0)
          return { success: true };
          const err = { message: `Cannot delete ${this.resourceName} for id: ${id}` };
          throw err;
        }

}