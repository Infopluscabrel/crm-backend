import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { Status, TypeVente } from "../entity/enums";
import { Vente } from "../entity/vente";

const venteRepository = AppDataSource.getRepository(Vente);

export async function createOrUpdateVente(vente: Vente) {
    return await venteRepository.save(vente);
}

export async function getOneVenteByID(id: number) {
    const rows = await venteRepository.findOne({
        where: { id_vente: id },
        relations: {
            lcoms: true
        }
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllVente(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await venteRepository.find(
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

export async function getAllVenteByFromUserAndType(page: number, user_id: number, type: TypeVente) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await venteRepository.find(
        {
            where: {
                fromUser: {
                    id_user: user_id
                },
                type: type
            },
            order: {
                id_vente: "DESC"
            },
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

export async function getAllVenteByToUser(page: number, user_id: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await venteRepository.find(
        {
            where: {
                toUser: {
                    id_user: user_id
                }
            },
            order: {
                id_vente: "DESC"
            },
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

export async function getAllVenteByUserAndPayStatus(page: number, user: number, status: Status) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await venteRepository.find(
        {
            where: {
                toUser: { id_user: user },
                paiement_status: status
            },
            order: {
                id_vente: "DESC"
            },
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

export async function getAllVenteByUserAndLivree(page: number, user: number, livree: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await venteRepository.find(
        {
            where: {
                toUser: {
                    id_user: user
                },
                livree: livree
            },
            order: {
                id_vente: "DESC"
            },
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

export async function getOneVenteByFacture(fact: number) {
    const rows = await venteRepository.findOneBy(
        {
            fact: {
                id_facture: fact
            }
        }
    )
    return emptyOrRows(rows);
}

export async function deleteVente(vente_id: number) {
    return await venteRepository.softDelete(vente_id);
}

