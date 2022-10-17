import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateFacture, findAllFacture, findOneFacture } from "../service/factureService";


const router = Router();

/* ADD Facture */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateFacture(req.body));
    } catch (err: any) {
        console.error(`Error while adding facture `, err.message);
        next(err);
    }
});

/* GET One Facture */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneFacture(id));
    } catch (err: any) {
        console.error(`Error while getting this facture `, err.message);
        next(err);
    }
});

/* UPDATE Category */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateFacture(req.body));
    } catch (err: any) {
        console.error(`Error while updating facture `, err.message);
        next(err);
    }
});

/* GET ALL Facture */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await findAllFacture());
    } catch (err: any) {
        console.error(`Error while finding all facture `, err.message);
        next(err);
    }
});

export default router;