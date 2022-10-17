import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { Facture } from "../entity/facture";

const factRepository = AppDataSource.getRepository(Facture);


export async function createOrUpdateFacture(fact: Facture) {
    return await factRepository.save(fact);
}

export async function getOneByIDFacture(id: number) {
    const rows = await factRepository.findOneBy({
        id_facture: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllFacture(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await factRepository.find(
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
