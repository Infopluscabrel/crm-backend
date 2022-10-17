import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { LigneCommande } from "../entity/ligneCommande";

const lcomRepository = AppDataSource.getRepository(LigneCommande);


export async function createOrUpdateLCommande(lcom: LigneCommande) {
    return await lcomRepository.save(lcom);
}

export async function getOneLCByID(id: number) {
    const rows = await lcomRepository.findOneBy({
        id_lc: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllLCByVente(vente_id: number) {
    const rows = await lcomRepository.find(
        {
            where: {
                vente: {
                    id_vente: vente_id
                }
            },
            order: {
                id_lc: "DESC",
                created_at: "DESC"
            },
        }
    )
    const data: LigneCommande[] = emptyOrRows(rows);

    return {
        data
    };
}

export async function getAllLCom(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await lcomRepository.find(
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

export async function deleteLCom(id: number) {
    return await lcomRepository.softDelete(id);
}
