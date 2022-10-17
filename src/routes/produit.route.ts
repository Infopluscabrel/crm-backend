import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import {
    addOrUpdateProduct, deleteOneProd, findAllProd, findAllProdByCat, findOneProd
} from "../service/produitService";


const router = Router();

/* ADD Product */
router.post("/new", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateProduct(req.body));
    } catch (err: any) {
        console.error(`Error while adding product `, err.message);
        next(err);
    }
});

/* GET One Product */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneProd(id));
    } catch (err: any) {
        console.error(`Error while getting this product `, err.message);
        next(err);
    }
});

/* GET All Products */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        res.status(200).json(await findAllProd(page));
    } catch (err: any) {
        console.error(`Error while getting all products `, err.message);
        next(err);
    }
});


/* GET All Products by Category */
router.get("/catprod/:cat([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let id: any = req.params.cat;
        res.status(200).json(await findAllProdByCat(page, id));
    } catch (err: any) {
        console.error(`Error while getting these products `, err.message);
        next(err);
    }
});

/* UPDATE Category */
router.put("/update", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateProduct(req.body));
    } catch (err: any) {
        console.error(`Error while updating product `, err.message);
        next(err);
    }
});

/* DELETE Category */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOneProd(id));
    } catch (err: any) {
        console.error(`Error while deleting product `, err.message);
        next(err);
    }
});

export default router;