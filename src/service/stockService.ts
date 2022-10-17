import { Stock } from "../entity/stock";
import {
    createOrUpdateStock, deleteStock, getAllStockByUser,
    getAllStockByUserAndCatProd, getAllStockByUserAndValidation,
    getOneStockByID
} from "../repository/stockRepository";


export async function addOrUpdateStock(stock: Stock) {
    return createOrUpdateStock(stock);
}

export async function findOneStock(id: number) {
    return getOneStockByID(id);
}

export async function findAllStockByUser(page = 1, user: number) {
    return getAllStockByUser(page, user);
}

export async function findAllStockByUserAndCatProd(page = 1, user: number, catprod: number) {
    return getAllStockByUserAndCatProd(page, user, catprod);
}

export async function findAllStockByUserAndValidation(page = 1, user: number, val: boolean) {
    return getAllStockByUserAndValidation(page, user, val);
}

/*export async function findAllStock(page = 1) {
    return getAllStock(page);
}*/

export async function deleteOneStock(id: number) {
    return deleteStock(id);
}
