import { validate } from "class-validator";
import { Role } from "../entity/role";
import { createOrUpdateRole, deleteRole, getAllRoles, getOneRoleByID } from "../repository/roleRepository";

export async function addOrUpdateRole(role: Role) {
    const errors = await validate(role)
    if (errors.length > 0) {
        throw new Error(`Validation failed!`)
    } else {
        return createOrUpdateRole(role);
    }
}

export async function findOneRole(id: number) {
    return getOneRoleByID(id);
}

export async function findAllRole() {
    return getAllRoles();
}

export async function deleteOneRole(id: number) {
    return deleteRole(id);
}