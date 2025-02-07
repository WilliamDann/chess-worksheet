// import { Request, Response }    from 'express';
// import { requireFields }        from '../../util/bodyParserUtil';
// import Worksheet                from '../model/old/Worksheet';
// import Env                      from '../../env';
// import { SqlError }             from '../model/old/SqlObject';
// import SignInError              from '../../error/SignInError';
// import PermissionError          from '../../error/PermissionError';

// export default function()
// {
//     const app = Env.instance().app;
//     const db  = Env.instance().db;
    
//     app.get('/tools/worksheet/create', (req: Request, res: Response) => {
//         res.render('worksheet/create');
//     });

//     app.get('/tools/worksheet', (req: Request, res: Response) => {
//         if (!req.cookies.username)
//             throw new SignInError();

//         db.query(`select * from worksheet where author="${req.cookies.username}"`, (err, result) => {
//             if (err) throw new SqlError(''+err);
//             res.render('worksheet/list', { sheets: result });
//         });
//     });

//     app.get('/tools/worksheet/read',   async (req: Request, res: Response) => {
//         requireFields(req.query, ['id']);

//         let worksheet = new Worksheet(req.query.id as string);
//         await worksheet.read();

//         res.render('worksheet/read', { worksheet: worksheet });
//     });
 
//     app.get('/tools/worksheet/update', async (req: Request, res: Response) => {
//         requireFields(req.query, ['id']);

//         let worksheet = new Worksheet(req.query.id as string);
//         await worksheet.read();

//         res.render('worksheet/update', { worksheet: worksheet });
//     });

//     app.get('/tools/worksheet/delete', async (req: Request, res: Response) => {
//         requireFields(req.query, ['id']);

//         let worksheet = new Worksheet(req.query.id as string);
//         await worksheet.read();

//         res.render('worksheet/delete', { worksheet: worksheet });
//     });

//     app.get('/tools/worksheet/export', async (req: Request, res: Response) => {
//         requireFields(req.query, ['id']);

//         let worksheet = new Worksheet(req.query.id as string);
//         await worksheet.read();

//         res.render('worksheet/export', { worksheet: worksheet });
//     });

//     app.post('/api/worksheet',         async (req: Request, res: Response) => {
//         requireFields(req.body, ['title', 'pgn']);

//         if (!req.cookies.username || !req.cookies.token)
//             throw new SignInError();

//         // add to db
//         let worksheet    = new Worksheet();
//         worksheet.author = req.cookies.username;
//         worksheet.title  = req.body.title;
//         worksheet.pgn    = req.body.pgn;

//         await worksheet.create();

//         // OK
//         res.render('worksheet/read', {worksheet: worksheet, message: { title: "Message", text: "Worksheet created." }});
//     });

//     app.post('/api/worksheet/update',  async (req: Request, res: Response) => {
//         requireFields(req.body, ['id', 'title', 'pgn'])

//         if (!req.cookies.username || !req.cookies.token)
//             throw new SignInError();

//         // change in db
//         let worksheet = new Worksheet(req.body.id);
//         await worksheet.read();


//         if (worksheet.author != req.cookies.username)
//             throw new PermissionError();

//         worksheet.title = req.body.title;
//         worksheet.pgn   = req.body.pgn;

//         // OK
//         res.render('worksheet/read', {worksheet: worksheet, message: { title: "Message", text: "Worksheet updated." }});    
//     });

//     app.post('/api/worksheet/delete',  async (req: Request, res: Response) => {
//         requireFields(req.body, ['id']);

//         if (!req.cookies.username || !req.cookies.token)
//             throw new SignInError();

//         // change in db
//         let worksheet = new Worksheet(req.body.id);
//         await worksheet.read();

//         if (worksheet.author != req.cookies.username)
//             throw new PermissionError();

//         await worksheet.delete();

//         // OK
//         res.render('page/dash', { message: { title: "Message", text: "Worksheet deleted." } });    
//     });
// }