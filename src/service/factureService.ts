import { Facture } from "../entity/facture";
import { createOrUpdateFacture, getAllFacture, getOneByIDFacture } from "../repository/factureRepository";

export async function addOrUpdateFacture(fact: Facture) {
    return createOrUpdateFacture(fact);
}

export async function findOneFacture(id: number) {
    return getOneByIDFacture(id);
}

export async function findAllFacture(page = 1) {
    return getAllFacture(page);
}
