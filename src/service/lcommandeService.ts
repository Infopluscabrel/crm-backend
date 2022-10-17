import { TypeVente } from "../entity/enums";
import { LigneCommande } from "../entity/ligneCommande";
import {
    createOrUpdateLCommande, deleteLCom,
    getAllLCByVente, getAllLCom, getOneLCByID
} from "../repository/ligneCommandeRepository";

export async function addOrUpdateLC(lc: LigneCommande) {
    if (lc.vente.type == TypeVente.VENTE) {
        if (lc.quantite > lc.stock.quantite) {
            return 0;
        } else {
            lc.stock.quantite -= lc.quantite;
        }
    }
    return createOrUpdateLCommande(lc);
}

export async function findOneLC(id: number) {
    return getOneLCByID(id);
}

export async function findAllLCByVente(vente_id: number) {
    return getAllLCByVente(vente_id);
}

export async function findAllLc(page: number) {
    return getAllLCom(page);
}

export async function deleteOnelc(id: number) {
    return deleteLCom(id);
}
