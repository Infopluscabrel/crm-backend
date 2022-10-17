import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateLC, deleteOnelc, findAllLc, findAllLCByVente, findOneLC } from "../service/lcommandeService";


const router = Router();

/* ADD Command Line */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateLC(req.body));
    } catch (err: any) {
        console.error(`Error while adding command line `, err.message);
        next(err);
    }
});

/* GET One Command Line */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneLC(id));
    } catch (err: any) {
        console.error(`Error while getting this command line `, err.message);
        next(err);
    }
});

/* UPDATE Command Line */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateLC(req.body));
    } catch (err: any) {
        console.error(`Error while updating command line `, err.message);
        next(err);
    }
});

/* GET ALL Command Line */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        res.status(200).json(await findAllLc(page));
    } catch (err: any) {
        console.error(`Error while finding all command line `, err.message);
        next(err);
    }
});

/* GET ALL Command Line For Given Vente */
router.get("/:id/vente", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let vente_id: any = req.params.id;
        res.status(200).json(await findAllLCByVente(vente_id));
    } catch (err: any) {
        console.error(`Error while finding all command line`, err.message);
        next(err);
    }
});

/* DELETE Category */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOnelc(id));
    } catch (err: any) {
        console.error(`Error while deleting command line `, err.message);
        next(err);
    }
});

export default router;