import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { CatProd } from "../entity/categorieProduit";

const catprodRepository = AppDataSource.getRepository(CatProd);


export async function createOrUpdateCatProd(catProd: CatProd) {
    return await catprodRepository.save(catProd);
}

export async function getOneCatProdByID(id: number) {
    const rows = await catprodRepository.findOneBy({
        id_categorie: id
    })
    const data = emptyOrRows(rows);
    return data;
}

export async function getAllCatProd(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await catprodRepository.find(
        {
            relations: {
                produits: false
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

export async function deleteCatProd(id: number) {
    return await catprodRepository.softDelete(id);
    /* return await catprodRepository
        .createQueryBuilder()
        .delete()
        .from(CatProd)
        .where("id_categorie = :id", { id: 1 })
        .execute() */
}
