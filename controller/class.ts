import { Request, Response }    from "express"
import Env                      from "../env"
import { requireFields }        from "../util/bodyParserUtil";
import queryAsync               from "../util/queryAsync";
import { ItemMissingError }     from "../error/ItemMissingError";
import SignInError              from "../error/SignInError";
import PermissionError          from "../error/PermissionError";
import Class                    from "../model/Class";
import sqlSetString             from "../util/sqlSetString";
import { escape }               from "mysql";

export default function()
{
    const app = Env.instance().app;

    // routes
    app.get('/class/read', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select classes.*, users.name as username from classes join users on users.id=classes.coach where classes.id=${req.query.id}`);
        if (results.length == 0)
            throw new ItemMissingError();

        res.render('class/read', { clss: results[0] });
    });

    app.get('/class/create', (req: Request, res: Response) => {
        res.render('class/create');
    });

    app.get('/class/update', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select classes.*, users.name as username from classes join users on users.id=classes.coach where classes.id=${req.query.id}`);
        if (results.length == 0)
            throw new ItemMissingError();

        res.render('class/update', { clss: results[0] });
    });

    app.get('/class/delete', async (req: Request, res: Response) => {
        requireFields(req.query, ['id']);

        const results = await queryAsync(`select classes.*, users.name from classes join users on users.id=classes.coach where classes.id=${req.query.id}`);
        if (results.length == 0)
            throw new ItemMissingError();

        res.render('class/delete', { clss: results[0] });
    });

    app.get('/class/my', async (req: Request, res: Response) => {
        if (!req.cookies.userid)
            throw new SignInError();

        const results = await queryAsync(`select * from classes where coach=${req.cookies.userid}`);
        res.render('class/list', { classes: results });
    });

    // api
    app.post('/class/create', async (req: Request, res: Response) => {
        requireFields(req.body, ['name', 'descr']);
        if (!req.cookies.userid)
            throw new SignInError();

        await queryAsync(`insert into 
            classes (name, descr, coach) 
            values  (${escape(req.body.name)}, ${escape(req.body.descr)}, ${escape(req.cookies.userid)})`);
    
        res.render('page/dash', { message: { title: "Class Create", text: "Class created." } });
    });

    app.post('/class/update', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);

        const result = await queryAsync(`select * from classes where id=${escape(req.body.id)}`) as Class[];
        if (result.length == 0)
            throw new ItemMissingError();
        
        const clss = result[0];
        if (clss.coach != req.cookies.userid)
            throw new PermissionError();

        // do not allow changing of the owner
        delete req.body.coach;

        await queryAsync(`update classes ${sqlSetString(req.body)} where id=${escape(req.body.id)}`);
        
        res.render('page/dash', { message: { title: 'Class Update', text: 'Class updated.' } });
    });

    app.post('/class/delete', async (req: Request, res: Response) => {
        requireFields(req.body, ['id']);

        const result = await queryAsync(`select * from classes where id=${req.body.id}`) as Class[];
        if (result.length == 0)
            throw new ItemMissingError();
        
        const assignment = result[0];
        if (assignment.coach != req.cookies.userid)
            throw new PermissionError();

        await queryAsync(`delete from enrollment where classid=${escape(req.body.id)}`);
        await queryAsync(`delete from classes where id=${escape(req.body.id)}`);
        
        res.render('page/dash', { message: { title: 'Class Delete', text: 'Class deleted.' } });

    });
}