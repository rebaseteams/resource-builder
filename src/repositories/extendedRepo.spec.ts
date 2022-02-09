import { Column, Connection, ConnectionOptions, createConnection, Entity, PrimaryColumn } from "typeorm";
import { BaseTypeORMRepo } from ".";
import { RepoInterface } from "../interfaces";

type TestResource = {
    id: string;
    name: string;
    description: string;
}

@Entity()
export class TestResourceEntity {
    @PrimaryColumn() id: string;
    @Column() name: string;
    @Column() description: string;
}

describe('ExtendedTypeORMRepo', ()=>{
    class ExtendedTypeORMRepo extends BaseTypeORMRepo<TestResource>{
        constructor(connection: Connection, resourceName: string){
            super(connection, resourceName)
        }

        async create(data: TestResource): Promise<TestResource | Error> {
            const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi; 
            const isUUID = regexExp.test(data.id)
            if(isUUID){
                return super.create(data)
            }
            const err: Error = {
                name: 'Invalid Id Error',
                message: `Id passed is not valid UUID`,
                };
            return err
        }
    }

    const setup = async (): Promise<{ repo: RepoInterface<TestResource>, connection: Connection }> => {

        const config: ConnectionOptions = {
            name: 'default2',
            type: 'sqlite',
            database: 'test-database-2',
            entities: [
                TestResourceEntity
            ],
            synchronize: true
        };
        const connection: Connection = await createConnection(config);
        const repo: RepoInterface<TestResource> = new ExtendedTypeORMRepo(connection, 'TestResourceEntity')
        return { repo, connection }
    }

    describe('create', () => {
        it('should successfully call create method for valid UUID', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: 'a24a6ea4-ce75-4665-a070-57453082c256', name: 'nn', description: 'dd' }

            const actual = await repo.create(data);
            expect(actual).toBe(data);
            await connection.close(); 
        })

        it('should throw error if id passes is not valid UUID', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nn', description: 'dd' }
            const actual = await repo.create(data);
            const expected: Error = {
                name: 'Invalid Id Error',
                message: 'Id passed is not valid UUID',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close(); 
        })

        
    });
})