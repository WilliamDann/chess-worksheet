import { Request, Response, NextFunction } from "express";
import Env, { ServerMode } from "../env";

export default function(req: Request, res: Response, next: NextFunction)
{
    Env.instance().logger.info(`${req.method} - ${req.url} body: ${JSON.stringify(req.body)} query: ${JSON.stringify(req.query)}`);
    next();
}