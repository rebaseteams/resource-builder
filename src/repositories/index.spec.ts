/* eslint-disable @typescript-eslint/no-explicit-any */
import typeORM, { Connection, createConnection, Repository } from "typeorm"
import { BaseTypeORMRepo } from "."
import { RepoInterface } from "../interfaces"
import sinon from 'sinon'


type TestResource = {
    name: string;
    description: string;
}

describe('BaseTypeORMRepo', ()=>{

    const setup = async (): Promise<{base: RepoInterface<TestResource>, connection: Connection}>=>{
        console.log("before connection");
        
        const connection: Connection = await createConnection()
        const base: RepoInterface<TestResource> = new BaseTypeORMRepo<TestResource>(connection, 'TestResource')
        return {base, connection}
    }
    describe('create', ()=>{
        it('should sucessfully save written data when typeORM sucessfully persists', async ()=>{
            const{ base, connection} = await setup()
            const data: TestResource = {name:'nn', description:'dd'}
            sinon.stub(connection, 'getRepository').callsFake(()=>{
                console.log("calls fake fn");
                
                return new Repository<TestResource>() as Repository<any>
            })

            sinon.stub(typeORM, 'createConnection').callsFake( async ()=>{
                const options: typeORM.ConnectionOptions = {
                    type:"postgres",
                    driver:"fakeDriver",
                    database:"fakeDatabase"
                }
                console.log("calls fake fn of connection")
                return new Connection(options)
            })
            base.create(data)
            
        })

        // it.skip('should throw error when typeORM fails to persists')
    })
})