import { Request, Response } from "express";
import AuthError             from "../error/AuthError";
import queryAsync from "./queryAsync";
import { escape } from "mysql";
import Token from "../model/Token";

export default async function(req: Request, res: Response, next: Function)
{    
    let userid = req.cookies.userid;
    let token  = req.cookies.token;

    // if no auth info, nothing to verify
    if (!userid && !token)
    {
        next();
        return;
    }

    let results = await queryAsync(`select * from tokens where userid=${escape(userid)}`) as Token[];
    if (results.length == 0)
        throw new AuthError('Token Fail');

    let found = false;
    for (let storedToken of results)
        if (storedToken.token == token)
            found = true;

    if (!found)
        throw new AuthError('Token Fail')

    next();
}