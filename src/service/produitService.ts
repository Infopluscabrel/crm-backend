import { Produit } from "../entity/produit";
import {
    createOrUpdateProduit, deleteProduit, getAllProd, getAllProdByCatProd, getOneProdByID
} from "../repository/produitRepository";

export async function addOrUpdateProduct(prod: Produit) {
    return createOrUpdateProduit(prod);
}

export async function findOneProd(id: number) {
    return getOneProdByID(id);
}

export async function findAllProd(page = 1) {
    return getAllProd(page);
}

export async function findAllProdByCat(page = 1, cat_id: number) {
    return getAllProdByCatProd(page, cat_id);
}

export async function deleteOneProd(id: number) {
    return deleteProduit(id);
}
