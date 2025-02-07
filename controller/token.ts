import Env                      from "../env";
import { Request, Response }    from 'express';
import { requireFields }        from "../util/bodyParserUtil";
import queryAsync               from "../util/queryAsync";
import AuthError                from "../error/AuthError";
import User, { checkPassword }  from "../model/User";
import { genToken }             from "../model/Token";

export default function()
{
    const app  = Env.instance().app;
    const db   = Env.instance().db;
    
    app.post('/token/create', async (req: Request, res: Response) => {
        requireFields(req.body, ['username', 'password']);

        // read user data
        const userResult = await queryAsync(`select * from users where name=${db.escape(req.body.username)}`) as User[];
        if (userResult.length == 0)
            throw new AuthError();
        const user = userResult[0];

        // check password
        if (!await checkPassword(req.body.password, user.passwordHash))
            throw new AuthError();

        // generate token
        let token = genToken();
        await queryAsync(`insert into tokens (token, userid) values(${db.escape(token)}, ${db.escape(user.id)})`);

        res.cookie('userid', user.id);
        res.cookie('token', token);

        // OK
        res.render('page/dash', { title: 'User Auth', text: `Signed in as ${user.name}` });
    });
}