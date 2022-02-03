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

        create(data: TestResource): Promise<TestResource | Error> {
            return super.create(data)
        }
    }

    const setup = async (): Promise<{ repo: RepoInterface<TestResource>, connection: Connection }> => {

        const config: ConnectionOptions = {
            name: 'default',
            type: 'sqlite',
            database: 'test-database',
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
        it('should successfully save written data when typeORM sucessfully persists', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nn', description: 'dd' }

            const actual = await repo.create(data);
            expect(actual).toBe(data);
            await connection.close(); 
        })

        it('should throw error when typeORM fails to persists', async () => {
            const { repo, connection } = await setup()

            const actual = await repo.create({} as TestResourceEntity);

            const expected: Error = {
                name: 'Create Resource Error',
                message: 'Cannot create TestResourceEntity',
                stack: 'QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: test_resource_entity.id'
            };

            expect(actual).toStrictEqual(expected);

            await connection.close();
        });
    });
})