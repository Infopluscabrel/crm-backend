import { sign, verify, VerifyOptions } from "jsonwebtoken";
import { User } from "../entity/user";

export function validateToken(token: string): Promise<any> {
    const verifyOptions: VerifyOptions = {
        algorithms: ['HS256']
    };
    let tokensecret = process.env.JWT_SECRET as string
    return new Promise((resolve, reject) => {
        verify(token, tokensecret, verifyOptions, (error: any, decoded: any) => {
            error ? reject(error) : resolve(decoded);
        });
    });
}

export function validateRefreshToken(token: string): Promise<any> {
    const verifyOptions: VerifyOptions = {
        algorithms: ['RS256']
    };
    let tokensecret = process.env.RefreshsecretToken as string
    return new Promise((resolve, reject) => {
        verify(token, tokensecret, verifyOptions, (error: any, decoded: any) => {
            error ? reject(error) : resolve(decoded);
        });
    });
}

export function generateToken(user: User, time: number) {
    let tokensecret = process.env.JWT_SECRET as string;
    const token = sign({ id: user.id_user, login: user.login }, tokensecret, { algorithm: 'HS256', expiresIn: time });
    return token;
}