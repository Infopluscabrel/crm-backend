import { NextFunction, Request, Response } from 'express';
import { getOneUserByLoginOrEmail } from '../repository/userRepository';
import { validateToken } from '../security/jwt.Utils';
require('dotenv').config();

export const auth = () => async (req: Request, res: Response, next: NextFunction) => {
    try {
        let jwt = req.headers.authorization;
        if (!jwt) {
            return res.status(401).json({ error: 'You must authenticated to use this service' });
        }
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send({ error: 'Invalid Token' });
        } else {
            let decoded: any;
            await validateToken(token).then(async (value) => {
                decoded = value;
            });
            const user = await getOneUserByLoginOrEmail(decoded.login)
            if (user.length == 0) {
                res.status(401).send({ error: 'User Not Found with this ID' })
            }
            //res.status(200).send({ token: token, user: user[0] })
            next();
        }
    } catch (e) {
        console.log(e);
        res.status(401).send({ error: 'Please authenticate.' })
    }
}