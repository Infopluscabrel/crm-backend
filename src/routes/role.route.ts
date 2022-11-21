import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import { addOrUpdateRole, deleteOneRole, findAllRole, findOneRole } from "../service/roleService";


const router = Router();

/* ADD Role */
router.post("/new", async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateRole(req.body));
    } catch (err: any) {
        console.error(`Error while adding role `, err.message);
        next(err);
    }
});

/* GET One Role */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneRole(id));
    } catch (err: any) {
        console.error(`Error while getting this role `, err.message);
        next(err);
    }
});

/* GET All Roles */
router.get("/", async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await findAllRole());
    } catch (err: any) {
        console.error(`Error while getting all roles `, err.message);
        next(err);
    }
});


/* UPDATE Role */
router.put("/update/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await addOrUpdateRole(req.body));
    } catch (err: any) {
        console.error(`Error while updating role `, err.message);
        next(err);
    }
});

/* DELETE Role */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOneRole(id));
    } catch (err: any) {
        console.error(`Error while deleting role `, err.message);
        next(err);
    }
});

export default router;