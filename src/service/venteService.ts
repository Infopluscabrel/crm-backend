import { Status, TypeVente } from "../entity/enums";
import { LigneCommande } from "../entity/ligneCommande";
import { Stock } from "../entity/stock";
import { Vente } from "../entity/vente";
import { getOneByID } from "../repository/configRepository";
import { getOneStockByUserAndProduct } from "../repository/stockRepository";
import {
    createOrUpdateVente, deleteVente, getAllVente, getAllVenteByFromUserAndType,
    getAllVenteByToUser, getAllVenteByUserAndLivree, getAllVenteByUserAndPayStatus, getOneVenteByFacture, getOneVenteByID
} from "../repository/venteRepository";

export async function addOrUpdateVente(vente: Vente) {
    let error: boolean = false;
    if (vente.type == TypeVente.VENTE) {
        const lcoms = vente.lcoms;
        let nlcoms: LigneCommande[] = [];
        if (lcoms.length != 0) {
            lcoms.forEach(lc => {
                if (lc.quantite > lc.stock.quantite) {
                    error = true;;
                } else {
                    lc.stock.quantite -= lc.quantite;
                }
                nlcoms.push(lc);
            });
            if (error) {
                return 0;
            } else {
                vente.lcoms = [];
                vente.lcoms.concat(nlcoms);
            }
        }
        vente.date_paiement = new Date();
        vente.validee = 1;
        vente.date_validation = new Date();
        vente.livree = 1;
        vente.date_livraison = new Date();
        vente.paiement_status = Status.SUCCESS;
    }
    return createOrUpdateVente(vente);
}

export async function livree(vente_id: number) {
    let stocks: Stock[] = [];
    await getOneVenteByID(vente_id).then(async (value) => {
        if (value.length != 0) {
            return 0;
        }
        const data = value[0];
        if (data.type == TypeVente.COMMANDE && !data.livree) {
            const lcs: LigneCommande[] = data.lcoms;
            if (lcs.length != 0) {
                lcs.forEach((lc) => {
                    getOneStockByUserAndProduct(data.fromUser.id_user, lc.produit.id_produit)
                        .then((s1) => {
                            s1.quantite += lc.quantite;
                        });
                    getOneStockByUserAndProduct(data.toUser.id_user, lc.produit.id_produit)
                        .then((s2) => {
                            s2.quantite -= lc.quantite;
                        });
                });
            }
            data.livree = 1;
            data.date_livraison = new Date();
            return data
        }
    });
}

export async function findOneVente(id: number) {
    return getOneByID(id);
}

export async function findAllVenteFromUserAndType(page = 1, fuser: number, typ: TypeVente) {
    return getAllVenteByFromUserAndType(page, fuser, typ);
}

export async function findAllVenteToUser(page = 1, tuser: number) {
    return getAllVenteByToUser(page, tuser);
}

export async function findAllVenteByUserAndStatus(page = 1, user_id: number, status: Status) {
    return getAllVenteByUserAndPayStatus(page, user_id, status);
}

export async function findAllVenteByUserAndLivree(page = 1, user_id: number, livree: number) {
    return getAllVenteByUserAndLivree(page, user_id, livree);
}

export async function findOneVenteByFacture(fact: number) {
    return getOneVenteByFacture(fact);
}

export async function findAllVente(page = 1) {
    return getAllVente(page);
}

export async function deleteOneVente(id: number) {
    return deleteVente(id);
}