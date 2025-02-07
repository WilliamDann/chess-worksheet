import express              from 'express';
import bodyParser           from 'body-parser';
import cookieParser         from 'cookie-parser';
import authMiddleware       from './util/authMiddleware';
import errorMiddleware      from './util/errorMiddleware';

import routes               from './controller/all';
import Env, { ServerMode }  from './env';
import loggerMiddleware     from './util/loggerMiddleware';

export default function()
{
    Env.instance().app = express();
    Env.instance().app.set('view engine', 'ejs');
    Env.instance().app.use(express.static('static/'));
    Env.instance().app.use(bodyParser.urlencoded())
    Env.instance().app.use(cookieParser());

    if (Env.instance().mode == ServerMode.Development)
    {
        Env.instance().logger.info('development move logging active');
        Env.instance().app.use(loggerMiddleware);
    }

    Env.instance().app.use(authMiddleware);
    
    routes();

    Env.instance().app.use(errorMiddleware);
}