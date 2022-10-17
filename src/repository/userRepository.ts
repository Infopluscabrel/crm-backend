import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { User } from "../entity/user";

const userRepository = AppDataSource.getRepository(User);

export async function createOrUpdateUser(user: any) {
    return await userRepository.save(user);
}

export async function getOneUserByID(id: number) {
    const rows = await userRepository.findOneBy({
        id_user: id
    });

    return emptyOrRows(rows);
}

export async function getOneUserByLoginOrEmail(loginOrEmail: string) {
    const rows = await userRepository.find({
        where: [
            { login: loginOrEmail },
            { email: loginOrEmail }
            /*{ refresh_token: loginOrToken }*/
        ]
    });

    return emptyOrRows(rows);
}

export async function getOneUserByLoginAndRole(login: string, role_id: number) {
    const rows = await userRepository.findBy({
        login: login,
        role: {
            id_role: role_id
        }
    });

    return emptyOrRows(rows);
}

export async function getOneUserById(id: number) {
    const rows = await userRepository.find({
        select: {
            id_user: true,
            nom: true,
            prenom: true,
            login: true,
            email: true,
            telephone: true,
            IdOauth: true,
            mode_login: true,
            image: true,
            created_at: true,
            updated_at: true,
            role: {
                libelle: true
            }
        },
        where: [
            { id_user: id }
        ]
    });

    return emptyOrRows(rows);
}

export async function getAllUser(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await userRepository.find(
        {
            skip: offset,
            take: config.listPerPage
        }
    )
    const data = emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

export async function getAllChild(page: number, parrain: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await userRepository.find({
        where: {
            parrain: {
                id_user: parrain
            }
        },
        order: {
            nom: "ASC",
            id_user: "DESC"
        },
        skip: offset,
        take: config.listPerPage
    })

    const data = emptyOrRows(rows);
    const meta = { page };

    return {
        data,
        meta,
    };
}

export async function deleteUser(id: number) {
    return await userRepository.softDelete(id);
}
