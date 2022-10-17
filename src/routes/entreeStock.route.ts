import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateES, findOneES, findAllESByUser } from "../service/entreeStockService";

const router = Router();

/* ADD Stock Entry */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateES(req.body));
    } catch (err: any) {
        console.error(`Error while adding stock entry `, err.message);
        next(err);
    }
});

/* GET One Stock Entry */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneES(id));
    } catch (err: any) {
        console.error(`Error while getting this stock entry `, err.message);
        next(err);
    }
});

/* UPDATE Category */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateES(req.body));
    } catch (err: any) {
        console.error(`Error while updating stock entry `, err.message);
        next(err);
    }
});

/* GET ALL Stock Entry For Given User */
router.get("/:id/user", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let user_id: any = req.params.id;
        res.status(200).json(await findAllESByUser(page, user_id));
    } catch (err: any) {
        console.error(`Error while finding all stock entry`, err.message);
        next(err);
    }
});

export default router;