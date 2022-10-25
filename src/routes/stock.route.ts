import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateStock, deleteOneStock, findAllStockByUser, findAllStockByUserAndCatProd, findAllStockByUserAndValidation, findOneStock } from "../service/stockService";


const router = Router();

/* ADD Stock */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateStock(req.body));
    } catch (err: any) {
        console.error(`Error while adding stock `, err.message);
        next(err);
    }
});

/* GET One Stock */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneStock(id));
    } catch (err: any) {
        console.error(`Error while getting this stock `, err.message);
        next(err);
    }
});

/* UPDATE Stock */
router.put("/update/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateStock(req.body));
    } catch (err: any) {
        console.error(`Error while updating stock `, err.message);
        next(err);
    }
});

/* GET ALL Stock FOR Given User */
router.get("/:id([0-9]+)/user", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let user_id: any = req.params.id;
        res.status(200).json(await findAllStockByUser(page, user_id));
    } catch (err: any) {
        console.error(`Error while finding all stock `, err.message);
        next(err);
    }
});

/* GET ALL Stock  FOR Given User and Category */
router.get("/:id([0-9]+)/user/:cat([0-9]+)/cat", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let user_id: any = req.params.id;
        let cat_id: any = req.params.cat;
        res.status(200).json(await findAllStockByUserAndCatProd(page, user_id, cat_id));
    } catch (err: any) {
        console.error(`Error while finding all stock `, err.message);
        next(err);
    }
});

/* GET ALL Stock For Given User and Validation */
router.get("/:id([0-9]+)/user/:val/val", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let user_id: any = req.params.id;
        let val: any = req.params.val;
        res.status(200).json(await findAllStockByUserAndValidation(page, user_id, !!val));
    } catch (err: any) {
        console.error(`Error while finding all stock`, err.message);
        next(err);
    }
});

/* DELETE Category */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOneStock(id));
    } catch (err: any) {
        console.error(`Error while deleting stock `, err.message);
        next(err);
    }
});

export default router;