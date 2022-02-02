import { createConnection } from "typeorm";
import rolesData from "../../data/rolesData";
import Role from "../entities/role";
import { SomeRepo } from "./someRepo"

describe('SomeRepo', ()=>{
    let someRepo: SomeRepo;

    beforeAll( async ()=>{
        const connection = await createConnection()
        someRepo = new SomeRepo(connection, 'Role')
    })

    it('create role', async ()=>{
        const role = new Role(
        'ss', 'name', [{resourceId: 'ss', actions: [{name: 'ac', permission: true}]}]
        )
        const resp =  await someRepo.create(role)
        expect(role).toEqual(resp);
    })

    it('findOne',async () => {
        const expected = rolesData[0]
        const resp = await someRepo.findOne(rolesData[0].id)
        expect(expected).toEqual(resp);
    })

    it('find',async () => {
        const expected = rolesData
        const resp = await someRepo.find(2, 1)
        expect(expected).toEqual(resp);
    })

})