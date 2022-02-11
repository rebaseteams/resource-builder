/* eslint-disable @typescript-eslint/no-unused-vars */
import { Connection, FindManyOptions, Repository } from "typeorm";
import { RepoInterface } from "../interfaces";

export class BaseTypeORMRepo<T, U> implements RepoInterface<T>{
    private repository: Repository<U>;
    private resourceName: string;
    private typeToEntity: (t: T) => U;
    private entityToType: (u: U) => T;

      constructor(
        connection: Connection,
        resourceName: string,
        entityToType: (u: U) => T, 
        typeToEntity: (t: T) => U,
      ) {
        this.repository = connection.getRepository(resourceName);
        this.resourceName = resourceName;
        this.typeToEntity = typeToEntity;
        this.entityToType = entityToType;
      }
        async create(data: T): Promise<T | Error> {
          let resp: Awaited<U>;
          try {
            const entityData = this.typeToEntity(data);
            resp = await this.repository.save(entityData);
            return this.entityToType(resp);
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
            const item = await this.repository.findOne(id) as U;
            if (item) {
              return this.entityToType(item);
            }
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

        async find(filters?: FindManyOptions<any>): Promise<T[] | Error> {
          try {
            const items: U[] = await this.repository.find(filters);
            return items.map(this.entityToType);
          } catch (e) {
            const err: Error = {
              name: 'Find resource Internal Error',
              message: `Internal error occured while finding ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            return err
          }
        }

        async update(data: T): Promise<{ success: boolean }| Error> {
          try {
            const entityData = this.typeToEntity(data);
            await this.repository.save(entityData);
            return { success: true };
          } catch (e) {
            const err: Error = {
              name: 'Update Resource Error',
              message: `Error occured while updating ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            return err;
          }
        }

        async delete(id: string): Promise<{success: boolean}| Error> {
          if(!id){
            const err: Error = {
              name: 'Invalid Id Error',
              message: `Id passed is not valid`,
            };
            return err
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
            return err;
          } catch (e) {
            const err: Error = {
              name: 'Delete Resource Error',
              message: `Internal Error occured while deleting ${this.resourceName}`,
              stack: (e as Error).toString()
            };
            return err;
          }
        }

}