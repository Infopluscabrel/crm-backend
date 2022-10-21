import { EntreeStock } from "../entity/entreeStock";
import { createOrUpdateentStock, deleteES, getAllByUser, getOneESByID } from "../repository/entreeStockRepository";

export async function addOrUpdateES(es: EntreeStock) {
    es.stock.quantite += es.quantite;
    return createOrUpdateentStock(es);
}

export async function findOneES(id: number) {
    return getOneESByID(id);
}

export async function findAllESByUser(page = 1, id_user: number) {
    return getAllByUser(page, id_user);
}

export async function deleteOneES(id: number) {
    return deleteES(id);
}
