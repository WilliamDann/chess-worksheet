import { Request, Response }    from 'express';
import Env                      from "../env";
import { requireFields }        from '../util/bodyParserUtil';
import queryAsync               from '../util/queryAsync';
import User, { hashPassword }   from '../model/User';
import { ItemMissingError }     from '../error/ItemMissingError';
import SignInError              from '../error/SignInError';
import sqlSetString             from '../util/sqlSetString';
import PermissionError          from '../error/PermissionError';

export default function()
{
    const app  = Env.instance().app;
    const db   = Env.instance().db;
    
    // page routes
    app.get('/user/read', async (req: Request, res: Response) => {
        let userid = req.query.id ? req.query.id : req.cookies.userid;
        if (!userid)
            throw new SignInError();

        const results = await queryAsync(`select * from users where id=${userid};`) as User[];
        if (results.length == 0)
            throw new ItemMissingError();

        // remove password info from user data before sending
        const user = results[0] as any;
        delete user.passwordHash;

        res.render('user/read', { user: user });
    });

    app.get('/user/create', (req, res) => {
        res.render('user/create');
    });

    app.get('/user/auth', (req, res) => {
        res.render('user/auth');
    });

    app.get('/user/update', async (req: Request, res: Response) => {
        let userid = req.query.id ? req.query.id : req.cookies.userid;
        if (!userid)
            throw new SignInError();

        const result = await queryAsync(`select * from users where id=${userid}`) as User[];
        if (!result)
            throw new ItemMissingError();

        // delete user password info
        const user = result[0] as any;
        delete user.passwordHash;

        res.render('user/update', { user: user });
    });

    app.get('/user/delete', async (req: Request, res: Response) => {
        let userid = req.query.id ? req.query.id : req.cookies.userid;
        if (!userid)
            throw new SignInError();

        const results = await queryAsync(`select * from users where id=${userid};`) as User[];
        if (results.length == 0)
            throw new ItemMissingError();

        // remove password info from user data before sending
        const user = results[0] as any;
        delete user.passwordHash;

        res.render('user/delete', { user: user });
    });

    // api routes
    app.post('/user/create', async (req: Request, res: Response) => {
        requireFields(req.body, ['username', 'email', 'password']);

        await queryAsync(`
            insert into users 
                (name, email, passwordHash) 
            values(
                ${db.escape(req.body.username)},
                ${db.escape(req.body.email)},
                ${db.escape(await hashPassword(req.body.password))}
            )`);

        res.render('user/auth', { message: { title: "Create User", text: "User was created, please sign in."} });
    });

    app.post('/user/update', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);
        if (!req.cookies.userid || req.cookies.userid != req.body.id)
            throw new PermissionError();

        await queryAsync(`update users ${sqlSetString(req.body)} where id=${db.escape(req.body.id)}`);

        res.render(`page/redir`, { redir: '/user/read', title: 'User Update', text: 'User information updated.' });
    });

    app.post('/user/delete', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);
        if (!req.cookies.userid || req.cookies.userid != req.body.id)
            throw new PermissionError();

        await queryAsync(`delete from tokens where userid=${db.escape(req.body.id)}`)
        await queryAsync(`delete from users where id=${db.escape(req.body.id)}`);

        res.render('page/dash', { title: 'Delete User', text: 'User was deleted.' })
    });
}