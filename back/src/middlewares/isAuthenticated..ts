import { NextFunction, Request, Response } from "express";
import {verify} from 'jsonwebtoken'

interface PayLoad{
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
){
    //Receber o Token
    const authToken = req.headers.authorization;

    if(!authToken){
        return res.status(401).end();
    }
    
    const [, token] = authToken.split(" ")

    //Validar o Token
    try{
        const {sub} = verify(
            token,
            process.env.JWT_SECREAT
        )as PayLoad;

        //Criando uma tipagem para o id do Usuário: user_id.
        //Recuperar o id do token e colocar dentro de uma variavel, user_id dentro do req.
        req.userId = sub;
    
        return next();
    
    }catch(err) {
        return res.status(401).end();
    }
}