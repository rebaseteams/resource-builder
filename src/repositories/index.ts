import { createConnection, Repository } from "typeorm";
import { GenericInterface } from "../interfaces";

export class GenericRepo<T> implements GenericInterface<T>{
    private repository: Repository<T>

    constructor(type: string) {
        createConnection().then((connection) => {
          this.repository = connection.getRepository(type);
        });
      }

        async findOne(id: string): Promise<T> {
            const item = await this.repository.findOne(id);
            if (item) return item;
            const err = { message: `Resource not found for id: ${id}`, statusCode: 404 };
            throw err;
        }

}