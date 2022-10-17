import { config } from "../config";
import { emptyOrRows, getOffset } from "../helper";
import { AppDataSource } from "../data-source";
import { Stock } from "../entity/stock";

const stockRepository = AppDataSource.getRepository(Stock);


export async function createOrUpdateStock(stock: Stock) {
    return await stockRepository.save(stock);
}

export async function getOneStockByID(id: number) {
    const rows = await stockRepository.findOneBy({
        id_stock: id
    })
    let data: Stock = emptyOrRows(rows);
    return data;
}

export async function getOneStockByUserAndProduct(user_id: number, prod_id: number) {
    const rows = await stockRepository.findOneBy({
        user: {
            id_user: user_id
        },
        produit: {
            id_produit: prod_id
        }
    })
    let data: Stock = emptyOrRows(rows);
    return data;
}

export async function getAllStockByUser(page: number, user_id: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await stockRepository.find(
        {
            where: {
                user: {
                    id_user: user_id
                }
            },
            order: {
                produit: {
                    nom_produit: "ASC"
                }
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

export async function getAllStockByUserAndCatProd(page: number, user_id: number, catprod_id: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await stockRepository.find(
        {
            where: {
                user: {
                    id_user: user_id
                },
                produit: {
                    cat_prod: {
                        id_categorie: catprod_id
                    }
                }
            },
            order: {
                produit: {
                    nom_produit: "ASC"
                }
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


export async function getAllStockByUserAndValidation(page: number, user_id: number, val: boolean) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await stockRepository.find(
        {
            where: {
                user: {
                    id_user: user_id
                },
                validation: val
            },
            order: {
                produit: {
                    nom_produit: "ASC"
                }
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

export async function getAllStock(page: number) {
    const offset = getOffset(page, config.listPerPage);
    const rows = await stockRepository.find(
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

export async function deleteStock(id: number) {
    return await stockRepository.softDelete(id);
}
