import { validate } from "class-validator";
import { CatProd } from "../entity/categorieProduit";
import { createOrUpdateCatProd, deleteCatProd, getAllCatProd, getOneCatProdByID }
    from "../repository/catProdRepository";

export async function addCatProd(cp: CatProd) {
    const errors = await validate(cp)
    if (errors.length > 0) {
        throw new Error(`Validation failed!`)
    } else {
        return createOrUpdateCatProd(cp);
    }
}

export async function UpdateCatProd(id: number, cp: CatProd) {
    const errors = await validate(cp)
    if (errors.length > 0) {
        throw new Error(`Validation failed!`)
    } else {
        cp.id_categorie = id;
        return createOrUpdateCatProd(cp);
    }
}

export async function findOneCatProd(id: number) {
    return getOneCatProdByID(id);
}

export async function findAllCatProd(page = 1) {
    return getAllCatProd(page);
}

export async function deleteOneCatProd(id: number) {
    return deleteCatProd(id);
}
