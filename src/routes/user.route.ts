import { NextFunction, Request, Response, Router } from "express";
import { auth } from "../middleware/auth";
import {
    addUser, UpdateUser, deleteOneUser, findAllChild, findAllUser, findOneUser, findOneUserById,
    findOneUserByLoginOrEmail, login, refreshToken, updatepassword
} from "../service/userService";


const router = Router();
const base64 = require('base-64');
var utf8 = require('utf8');

/* ADD User */
router.post("/new", async function (req: Request, res: Response, next: NextFunction) {
    try {
        let basic = req.headers.authorization;
        if (!basic) {
            return res.status(400).json({ error: 'Bad Request!' });
        }
        const token = req.header('Authorization')?.replace('Basic ', '');
        if (!token) {
            res.status(401).send({ error: 'Invalid Basic Auth Token' });
        } else {
            const [login, password] = utf8.decode(base64.decode(token)).split(':');
            let user = req.body;
            user.password = password;
            user.login = login;
            res.status(200).json(await addUser(user));
        }
    } catch (err: any) {
        console.error(`Error while adding user `, err.message);
        next(err);
    }
});

/* GET One User */
router.get("/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneUser(id));
    } catch (err: any) {
        console.error(`Error while getting this user `, err.message);
        next(err);
    }
});

/* GET Partial User By ID */
router.get("/:id([0-9]+)/user", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await findOneUserById(id));
    } catch (err: any) {
        console.error(`Error while getting this user `, err.message);
        next(err);
    }
});

/* GET One User By Login or Email*/
router.get("/logOrEmail/:loe", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let loginOrEmail: any = req.params.loe;
        res.status(200).json(await findOneUserByLoginOrEmail(loginOrEmail));
    } catch (err: any) {
        console.error(`Error while getting this user `, err.message);
        next(err);
    }
});

/* UPDATE User */
router.put("/update/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        res.status(200).json(await UpdateUser(req.body));
    } catch (err: any) {
        console.error(`Error while updating user `, err.message);
        next(err);
    }
});

/* GET ALL CHILD OF A GIVEN USER */
router.get("/parrain/:parrain", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        let user_id: any = req.params.parrain;
        res.status(200).json(await findAllChild(page, user_id));
    } catch (err: any) {
        console.error(`Error while finding all user `, err.message);
        next(err);
    }
});

/* GET ALL User */
router.get("/", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let page: any = req.query.page || 1;
        res.status(200).json(await findAllUser(page));
    } catch (err: any) {
        console.error(`Error while finding all user `, err.message);
        next(err);
    }
});

/* LOGIN */
router.get("/login", async function (req: Request, res: Response, next: NextFunction) {
    try {
        let role_id: any = req.params.role;
        let basic = req.headers.authorization;
        if (!basic) {
            return res.status(400).json({ error: 'Bad Request!' });
        }
        const token = req.header('Authorization')?.replace('Basic ', '');
        if (!token) {
            res.status(401).send({ error: 'Invalid Basic Auth Token' });
        } else {
            const [log, pass] = utf8.decode(base64.decode(token)).split(':');
            const result = await login(log, pass);
            res.status(200).json(result);
        }
    } catch (err: any) {
        console.error(`Error while finding all user `, err.message);
        next(err);
    }
});

/* REFRESH USER TOKEN */
router.get("/refresh/:logOrEmail", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let loe: any = req.params.logOrEmail;
        res.status(200).json(await refreshToken(loe));
    } catch (err: any) {
        console.error(`Error while finding all user`, err.message);
        next(err);
    }
});

/* UPDATE PAWWORD */
router.put("/uppass/:id", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let user_id: any = req.params.id;
        let val: any = req.params.val;
        let basic = req.headers.authorization;
        if (!basic) {
            return res.status(400).json({ error: 'Bad Request!' });
        }
        const token = req.header('Authorization')?.replace('Basic ', '');
        if (!token) {
            res.status(401).send({ error: 'Invalid Basic Auth Token' });
        } else {
            const [opass, npass] = Buffer.from(basic, 'base64').toString().split(':')
            res.status(200).json(await updatepassword(user_id, opass, npass));
        }
    } catch (err: any) {
        console.error(`Error while finding all user`, err.message);
        next(err);
    }
});

/* DELETE Category */
router.delete("/del/:id([0-9]+)", auth(), async function (req: Request, res: Response, next: NextFunction) {
    try {
        let id: any = req.params.id;
        res.status(200).json(await deleteOneUser(id));
    } catch (err: any) {
        console.error(`Error while deleting user `, err.message);
        next(err);
    }
});

export default router;