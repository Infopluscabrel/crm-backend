import { NextFunction, Request, Response, Router } from "express"
import { auth } from "../middleware/auth";
import { deleteCatProd } from "../repository/catProdRepository";
import { addOrUpdateCatProd, findAllCatProd, findOneCatProd } from "../service/catProdService";

const router = Router();

/* ADD Category */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateCatProd(req.body));
    } catch (err: any) {
        console.error(`Error while adding category `, err.message);
        next(err);
    }
});


/* UPDATE Category */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateCatProd(req.body));
    } catch (err: any) {
        console.error(`Error while updating category `, err.message);
        next(err);
    }
});

/* GET FROM ID */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneCatProd(id));
    } catch (err: any) {
        console.error(`Error while finding category `, err.message);
        next(err);
    }
});


/* GET ALL Categories */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        res.status(200).json(await findAllCatProd(page));
    } catch (err: any) {
        console.error(`Error while finding all categories `, err.message);
        next(err);
    }
});

/* DELETE Category */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteCatProd(id));
    } catch (err: any) {
        console.error(`Error while deleting category `, err.message);
        next(err);
    }
});

export default router;