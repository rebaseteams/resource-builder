import "reflect-metadata";
import { createConnection } from "typeorm";
// import Role from "./entities/role";
// import { createConnection } from "typeorm";
import { SomeRepo } from "./repositories/someRepo";


(async ()=>{
    // const data = new Role(
    //     'id',
    //     'name'
    // )
    try {
        // const conn = await createConnection()
        // const repo =  await conn.getRepository('Role')
        const connection = await createConnection()

    const repo = new SomeRepo(connection, 'Role')
    // const role = new Role(
    //     'ss', 'name', [{resourceId: 'ss', actions: [{name: 'ac', permission: true}]}]
    // )
        const result = await repo.findOne('9b171474-5c41-4fa5-916671bb2bb899d')
        // const all = await repo.find(0, 10)
        // const create = await repo.create(role)
        console.log(result);
        
    } catch (error) {
        console.log(error);
        
    }
    
    
    
})()