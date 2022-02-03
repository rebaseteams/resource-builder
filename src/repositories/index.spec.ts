import { Column, Connection, ConnectionOptions, createConnection, Entity, PrimaryColumn } from "typeorm"
import { BaseTypeORMRepo } from "."
import { RepoInterface } from "../interfaces"


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

describe('BaseTypeORMRepo', () => {

    const setup = async (): Promise<{ base: RepoInterface<TestResource>, connection: Connection }> => {

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
        const base: RepoInterface<TestResource> = new BaseTypeORMRepo<TestResource>(connection, 'TestResourceEntity')
        return { base, connection }
    }
    describe('create', () => {
        it('should successfully save written data when typeORM sucessfully persists', async () => {
            const { base, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nn', description: 'dd' }

            const actual = await base.create(data);
            expect(actual).toBe(data);
            await connection.close(); 
        })

        it('should throw error when typeORM fails to persists', async () => {
            const { base, connection } = await setup()

            const actual = await base.create({} as TestResourceEntity);

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
            const { base, connection } = await setup()
            const actual = await base.findOne('');
            const expected: Error = {
                name: 'Invalid Id Error',
                message: 'Id passed is not valid',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should throw error when nothing found', async () => {
            const { base, connection } = await setup()
            const actual = await base.findOne('a');
            const expected: Error = {
                name: 'Find resource by Id Error',
                message: 'TestResourceEntity not found for id: a',
            };
            expect(actual).toStrictEqual(expected);
            await connection.close();
        });

        it('should sucessfully find the resource for given id', async () => {
            const { base, connection } = await setup()
            const data: TestResource = { id: '1', name: 'nns', description: 'ddd' }
            await base.create(data);
            const actual = await base.findOne('1');
            expect(actual).toEqual(data);
            await connection.close();
        })
    })
})