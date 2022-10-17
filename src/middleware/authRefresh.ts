import { Request, Response } from 'express';
import { getOneUserByLogin } from '../repository/userRepository';
import { validateRefreshToken } from '../security/jwt.Utils';
require('dotenv').config();

export const auth = (allowedAccessTypes: string[]) => async (req: Request, res: Response, next: any) => {
    try {
        let jwt = req.headers.authorization;
        if (!jwt) {
            return res.status(401).json({ error: 'You must authenticated to user this service' });
        }
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            res.status(401).send({ error: 'Invalid Token' });
        } else {
            let decoded: any;
            validateRefreshToken(token).then(async (value) => {
                decoded = value;
            });
            const user = await getOneUserByLogin(decoded.login)
            if (!user) {
                res.status(401).send({ error: 'User Not Found with this ID' })
            }
            res.status(200).send({ token: token, user: user.data[0] })
            next();
        }
    } catch (e) {
        console.log(e);
        res.status(401).send({ error: 'Please authenticate.' })
    }
}