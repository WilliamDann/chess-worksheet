import { NextFunction, Request, Response } from "express";
import AppError                            from "../error/AppError";
import SignInError                         from "../error/SignInError";
import Env, { ServerMode }                 from "../env";
import AuthError                           from "../error/AuthError";
import { MysqlError }                      from "mysql";

export default function(err: Error, req: Request, res: Response, next: NextFunction)
{
    if (err instanceof AppError)
    {
        Env.instance().logger.error(`AppError: ${err.constructor.name} -  ${err.toString()}`);

        const errObject = {} as any;
        errObject[err.errorType as string] = { title: err.title, text: err.message };

        if (err instanceof SignInError)
        {
            res.render(err.errorPage, errObject);
            return;
        }
        if (err instanceof AuthError)
        {
            res.clearCookie('token');
            res.clearCookie('userid');
        }
        res.render(err.errorPage, errObject);
        return;
    }

    // if it's a mysql error
    if ((err as MysqlError).sqlMessage)
    {
        Env.instance().logger.error(`SqlError: -  ${err.toString()}`);

        if (Env.instance().mode == ServerMode.Development)
        {
            res.render('page/error', { error: { title: "SQL Error", text: err.message } });
            return;
        }
        else
        {
            res.render('page/error', { error: {title: "Server Error", text: "A server error has occored"} });
            return;
        }
    }

    next(err);
}