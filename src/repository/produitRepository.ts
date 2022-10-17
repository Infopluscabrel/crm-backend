import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { Produit } from "../entity/produit";

const prodRepository = AppDataSource.getRepository(Produit);


export async function createOrUpdateProduit(prod: Produit) {
    return await prodRepository.save(prod);
}

export async function getOneProdByID(id: number) {
    const rows = await prodRepository.findOneBy({
        id_produit: id
    })
    let data: Produit = emptyOrRows(rows);
    return data;
}

export async function getAllProdByCatProd(page: number, catprod_id: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await prodRepository.find(
        {
            where: {
                cat_prod: {
                    id_categorie: catprod_id
                }
            },
            order: {
                nom_produit: "ASC"
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

export async function getAllProd(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await prodRepository.find(
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

export async function deleteProduit(id: number) {
    return await prodRepository.softDelete(id);
}
