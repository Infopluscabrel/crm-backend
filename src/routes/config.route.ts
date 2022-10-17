import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateConfig, findOneConfig, findAllConfig } from "../service/configService";


const router = Router();

/* ADD Config */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateConfig(req.body));
    } catch (err: any) {
        console.error(`Error while adding config `, err.message);
        next(err);
    }
});

/* GET One Config */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneConfig(id));
    } catch (err: any) {
        console.error(`Error while getting this config `, err.message);
        next(err);
    }
});

/* UPDATE Category */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateConfig(req.body));
    } catch (err: any) {
        console.error(`Error while updating config `, err.message);
        next(err);
    }
});

/* GET ALL Config */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await findAllConfig());
    } catch (err: any) {
        console.error(`Error while finding all config `, err.message);
        next(err);
    }
});

export default router;