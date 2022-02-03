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

        findOne(id: string): Promise<TestResource | Error> {
            return super.findOne(id)
        }

        find(skip: number, limit: number): Promise<Error | TestResource[]> {
            return super.find(skip, limit)
        }

        update(data: TestResource): Promise<Error | { success: boolean; }> {
            return super.update(data)
        }

        delete(id: string): Promise<Error | { success: boolean; }> {
            return super.delete(id)
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

    describe('findOne', ()=>{

        it('should throw error when invalid id is passed', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.findOne('');
            const expected: Error = {
                name: 'Invalid Id Error',
                message: 'Id passed is not valid',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should throw error when nothing found', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.findOne('a');
            const expected: Error = {
                name: 'Find resource by Id Error',
                message: 'TestResourceEntity not found for id: a',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should sucessfully find the resource for given id', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nns', description: 'ddd' }
            await repo.create(data);
            const actual = await repo.findOne('1');
            expect(actual).toEqual(data);
            await connection.close();
        })
    })

    describe('find', ()=>{

        it('should throw error when invalid skip or limit is passed', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.find(null as unknown as number, null as unknown as number);
            const expected: Error = {
                name: 'Invalid query Error',
                message: 'queries passed are not valid',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should sucessfully find the resources', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nns', description: 'ddd' }
            await repo.create(data);
            const actual = await repo.find(0, 1);
            expect(actual).toEqual([data]);
            await connection.close();
        })
    })

    describe('update', ()=>{

        it('should successfully update the resource', async () => {
            const { repo, connection } = await setup()
            const orignalData: TestResource = { id: '1', name: 'nn', description: 'dd44' }
            const newData: TestResource = { id: '1', name: 'aa', description: 'aaa' }
            await repo.create(orignalData);
            const actual = await repo.update(newData)
            expect(actual).toStrictEqual({success: true});
            await connection.close();
        });

        it('should throw error when typeORM fails to persists', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.update({} as TestResourceEntity);
            const expected: Error = {
                name: 'Update Resource Error',
                message: 'Error occured while updating TestResourceEntity',
                stack: 'QueryFailedError: SQLITE_CONSTRAINT: NOT NULL constraint failed: test_resource_entity.id'
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });
    })

    describe('delete', ()=>{

        it('should throw error when invalid id is passed', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.delete('');
            const expected: Error = {
                name: 'Invalid Id Error',
                message: 'Id passed is not valid',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should successfully delete the resource', async () => {
            const { repo, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nn', description: 'dd44' }
            await repo.create(data);
            const actual = await repo.delete('1')
            expect(actual).toStrictEqual({success: true});
            await connection.close();
        });

        it('should throw error when unregistered id is passed', async () => {
            const { repo, connection } = await setup()
            const actual = await repo.delete('ssss');
            const expected: Error = {
                name: 'Delete Resource Error',
                message: 'Error occured while deleting TestResourceEntity for id: ssss',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });
    })
})