/* eslint-disable @typescript-eslint/no-unused-vars */
import { Connection, FindManyOptions, Repository } from "typeorm";
import { RepoInterface } from "../interfaces";

export class BaseTypeORMRepo<T> implements RepoInterface<T>{
    private repository: Repository<T>
    private resourceName: string

      constructor(connection: Connection, resourceName: string) {
      this.repository = connection.getRepository(resourceName);
      this.resourceName = resourceName
      }
        async create(data: T): Promise<T> {
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
            throw err;
          }
        }

        async findOne(id: string): Promise<T> {
          if(!id){
            const err: Error = {
              name: 'Invalid Id Error',
              message: `Id passed is not valid`,
            };
            throw err
          }
          try {
            const item = await this.repository.findOne(id) as T;
            if(item) {return item;}
            const err: Error = {
              name: 'Find resource by Id Error',
              message: `${this.resourceName} not found for id: ${id}`,
            };
            throw err
          } catch (e) {
            const err: Error = {
              name: 'Find resource by Id Internal Error',
              message: `Internal error occured while finding ${this.resourceName} id: ${id}`,
              stack: (e as Error).toString()
            };
            throw err
          }
        }

        async find(filters?: FindManyOptions<T>): Promise<T[]> {
          try {
            const items: T[] = await this.repository.find(filters);
            return items
          } catch (e) {
            const err: Error = {
              name: 'Find resource Internal Error',
              message: `Internal error occured while finding ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            throw err
          }
        }

        async update(data: T): Promise<{ success: boolean }> {
          try {
            await this.repository.save(data)
            return { success: true }
          } catch (e) {
            const err: Error = {
              name: 'Update Resource Error',
              message: `Error occured while updating ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            throw err;
          }
        }

        async delete(id: string): Promise<{success: boolean}> {
          if(!id){
            const err: Error = {
              name: 'Invalid Id Error',
              message: `Id passed is not valid`,
            };
            throw err
          }
          try {
            const resp = await this.repository.delete(id);
            const affected = resp.affected
            if(affected && affected > 0){
              return { success: true };
            }
            const err: Error = {
              name: 'Delete Resource Error',
              message: `Error occured while deleting ${this.resourceName} for id: ${id}`,
            };
            throw err;
          } catch (e) {
            const err: Error = {
              name: 'Delete Resource Error',
              message: `Internal Error occured while deleting ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            throw err;
          }
        }

}