import { NextFunction, Request, Response, Router } from "express";
import { Status, TypeVente } from "../entity/enums";
import { auth } from "../middleware/auth";
import {
    addOrUpdateVente, deleteOneVente, findAllVente,
    findAllVenteByUserAndLivree, findAllVenteByUserAndStatus,
    findAllVenteFromUserAndType, findAllVenteToUser, findOneVente,
    findOneVenteByFacture, livree
} from "../service/venteService";


const router = Router();

/* ADD Vente */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateVente(req.body));
    } catch (err: any) {
        console.error(`Error while adding vente `, err.message);
        next(err);
    }
});

/* GET One Vente */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneVente(id));
    } catch (err: any) {
        console.error(`Error while getting this vente `, err.message);
        next(err);
    }
});

/* GET One Vente By Facture */
router.get("/fact/:fact([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.fact;
        res.status(200).json(await findOneVenteByFacture(id));
    } catch (err: any) {
        console.error(`Error while getting this vente `, err.message);
        next(err);
    }
});

/* GET All Vente of given user and type */
router.get("/fuser/:id([0-9]+)/:type", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let id: any = req.params.id;
        let type = req.params.type.toUpperCase() as TypeVente;
        res.status(200).json(await findAllVenteFromUserAndType(page, id, type));
    } catch (err: any) {
        console.error(`Error while getting these ventes `, err.message);
        next(err);
    }
});

/* GET All Vente of given dest user */
router.get("/tuser/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let id: any = req.params.id;
        res.status(200).json(await findAllVenteToUser(page, id));
    } catch (err: any) {
        console.error(`Error while getting these ventes `, err.message);
        next(err);
    }
});

/* GET All Vente of given toUser and status */
router.get("/status/:id([0-9]+)/:stat", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let id: any = req.params.id;
        let status = req.params.stat.toUpperCase() as Status;
        res.status(200).json(await findAllVenteByUserAndStatus(page, id, status));
    } catch (err: any) {
        console.error(`Error while getting these ventes `, err.message);
        next(err);
    }
});

/* GET All Vente of given toUser and livraison status */
router.get("/tuser-liv/:id([0-9]+)/:liv", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let id: any = req.params.id;
        let livree: any = req.params.liv;
        res.status(200).json(await findAllVenteByUserAndLivree(page, id, livree));
    } catch (err: any) {
        console.error(`Error while getting these ventes `, err.message);
        next(err);
    }
});

/* GET All Ventes */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        res.status(200).json(await findAllVente(page));
    } catch (err: any) {
        console.error(`Error while getting all ventes `, err.message);
        next(err);
    }
});

/* UPDATE STOCK AFTER LIVRAISON */
router.get("/livree/:vente", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let vente_id: any = req.params.vente;
        res.status(200).json(await livree(vente_id));
    } catch (err: any) {
        console.error(`Error while updating stock after livraison `, err.message);
        next(err);
    }
});


/* UPDATE Vente */
router.put("/update/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateVente(req.body));
    } catch (err: any) {
        console.error(`Error while updating vente `, err.message);
        next(err);
    }
});

/* DELETE Vente */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOneVente(id));
    } catch (err: any) {
        console.error(`Error while deleting vente `, err.message);
        next(err);
    }
});

export default router;