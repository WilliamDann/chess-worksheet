// import { Request, Response }    from "express";

// import { requireFields }        from "../../util/bodyParserUtil";
// import User                     from "../model/old/User";
// import Env                      from "../../env";
// import Auth                     from "../model/old/Auth";
// import SignInError              from "../../error/SignInError";
// import AuthError                from "../../error/AuthError";
// import { SqlError }             from "../model/old/SqlObject";
// import InvalidRequestError from "../../error/InvalidRequestError";

// export default function() 
// {
//     const app = Env.instance().app;
//     const db  = Env.instance().db;

//     app.get('/user/read',   async (req: Request, res: Response) => {
//         let username = req.query.username ? req.query.username : req.cookies.username;
//         if (!username)
//             throw new SignInError();

//         let user = new User(username);
//         await user.read();

//         // clean data
//         let cpy = Object.assign({} as any, user);
//         delete cpy.passwordHash;

//         // render page
//         res.render('user/read', {
//             user    : cpy
//         });
//     });

//     app.get('/user/update', async (req: Request, res: Response) => {
//         let user = new User(req.body.username);
//         await user.read();
        
//         // clean data
//         let cpy = Object.assign({} as any, user);
//         delete cpy.passwordHash;

//         // render page
//         res.render('user/update', {
//             user    : cpy
//         });
//     });
    
//     app.get('/user/auth',   (req: Request, res: Response) => {
//         res.render('user/auth');
//     });

//     app.get('/user/create', (req: Request, res: Response) => {
//         res.render('user/create');
//     });

//     app.get('/user/signout', async (req: Request, res: Response) => {
//         let auth = new Auth(req.cookies.token);
//         await auth.delete();

//         // clear sign in cookies
//         res.clearCookie('username');
//         res.clearCookie('token');

//         // OK
//         res.render('user/auth', { message: { title: "Sign Out", text: "User signed out." } });
//     });

//     app.post('/api/user',   async (req: Request, res: Response) => {
//         requireFields(req.body, ['username', 'email', 'password']);
        
//         let user = new User(req.body.username);
//         user.setEmail(req.body.email);
//         user.setPassword(req.body.password);
        
//         try {
//             await user.create();
//         } catch (e)
//         {
//             if (e instanceof SqlError && e.obj?.code == 'ER_DUP_ENTRY')
//                 throw new InvalidRequestError('This email is already in use, please try signing in.', 'Account Create Error', 'user/create');
//             throw e;
//         }
        
//         // OK
//         res.render('user/auth', { message: { title: "Message", text: "User created." } });
//     });
    
//     app.post('/api/user/update', async (req: Request, res: Response) => {
//         requireFields(req.body, ['username', 'email']);

//         if (req.body.username != req.cookies.username)
//             throw new AuthError();

//         let user = new User(req.body.username);
//         user.setEmail(req.body.email);

//         await user.update();
        
//         // OK
//         res.render('page/dash', { message: { title: "Message", text: "User updated." } });
//     });
    
//     app.post("/api/user", async (req: Request, res: Response) => {
//         requireFields(req.body, ['username']);
        
//         if (!req.cookies.username || !req.cookies.password)
//             throw new AuthError();
//         if (req.cookies.username != req.body.username)
//             throw new AuthError();
        
//         let user = new User(req.body.username);
//         await user.delete();

//         // TODO this does not work?
//         db.query(`delete * from auth where username=${req.query.username}`);

//         res.sendStatus(200);
//     });
// }