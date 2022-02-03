/* eslint-disable @typescript-eslint/no-unused-vars */
import { Connection, Repository } from "typeorm";
import { RepoInterface } from "../interfaces";

export class BaseTypeORMRepo<T> implements RepoInterface<T>{
    private repository: Repository<T>
    private resourceName: string

      constructor(connection: Connection, resourceName: string) {
      this.repository = connection.getRepository(resourceName);
      this.resourceName = resourceName
      }
        update(data: T): Promise<{ success: boolean; }> {
          throw new Error("Method not implemented.");
        }
        delete(id: string): Promise<{ success: boolean; }> {
          throw new Error("Method not implemented.");
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

        async findOne(id: string): Promise<T | Error> {
          if(!id){
            const err: Error = {
              name: 'Invalid Id Error',
              message: `Id passed is not valid`,
            };
            return err
          }
          try {
            const item = await this.repository.findOne(id) as T;
            if(item) {return item;}
            const err: Error = {
              name: 'Find resource by Id Error',
              message: `${this.resourceName} not found for id: ${id}`,
            };
            return err
          } catch (e) {
            const err: Error = {
              name: 'Find resource by Id Internal Error',
              message: `Internal error occured while finding ${this.resourceName} id: ${id}`,
              stack: (e as Error).toString()
            };
            return err
          }
        }

        async find(skip : number, limit : number): Promise<T[] | Error> {
          if(!skip && !limit){
            const err: Error = {
              name: 'Invalid query Error',
              message: `queries passed are not valid`,
            };
            return err
          }
          try {
            const items: T[] = await this.repository.find({
              take: limit,
              skip,
            });
            return items
          } catch (e) {
            const err: Error = {
              name: 'Find resource Internal Error',
              message: `Internal error occured while finding ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            return err
          }
        }

        // async update(data: T): Promise<{ success: boolean }> {
        //   const resp = await this.repository.save(data)
        //   if(resp) return { success: true }
        //   const err = { message: `Cannot update ${this.resourceName}` };
        //   throw err;
        // }

        // async delete(id: string): Promise<{success: boolean}> {
        //   const resp =this.repository.delete(id);
        //   const affected = (await resp).affected
        //   if(affected && affected > 0)
        //   return { success: true };
        //   const err = { message: `Cannot delete ${this.resourceName} for id: ${id}` };
        //   throw err;
        // }

}