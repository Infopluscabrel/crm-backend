import { emptyOrRows } from "../helper";
import { AppDataSource } from "../data-source";
import { Role } from "../entity/role";

const roleRepository = AppDataSource.getRepository(Role);


export async function createOrUpdateRole(role: Role) {
    return await roleRepository.save(role);
}

export async function getOneRoleByID(id: number) {
    const rows = await roleRepository.findOneBy({
        id_role: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllRoles() {
    const rows = await roleRepository.find();
    return emptyOrRows(rows);
}

export async function deleteRole(id: number) {
    return await roleRepository.softDelete(id);
}