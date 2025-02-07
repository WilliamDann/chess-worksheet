import app                  from "./app";
import db                   from "./db";
import Env, { ServerMode }  from "./env";
import logger               from "./logger";

export default function()
{
    Env.instance().mode = ServerMode.Development;

    logger();
    db();
    app();
}