import {  Request, Response }   from 'express';
import Env                      from '../env';

export default function()
{
    const app = Env.instance().app;
    const db  = Env.instance().db;

    app.get('/', (req: Request, res: Response) => {
        if (!req.cookies.userid)
        {
            res.render('user/auth');
            return;
        }

        res.render('page/dash');
    });

    app.get('/tools', (req: Request, res: Response) => {
        res.render('page/tools');
    });
}