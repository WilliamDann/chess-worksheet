// import { Request, Response } from "express";
// import { requireFields }     from "../../util/bodyParserUtil";
// import User                  from "../model/old/User";
// import Auth                  from "../model/old/Auth";

// import Env                   from "../../env";
// import AuthError             from "../../error/AuthError";

// export default function()
// {
//     const app = Env.instance().app;

//     app.post('/api/auth', async (req: Request, res: Response) => {
//         requireFields(req.body, ['username', 'password']);

//         const user = new User(req.body.username);
//         await user.read();

//         if (!user.checkPassword(req.body.password))
//             throw new AuthError();

//         // create token
//         let auth      = new Auth();
//         auth.username = req.body.username;

//         await auth.create();

//         // set cookies
//         res.cookie('username', auth.username);
//         res.cookie('token', auth.token);

//         // OK
//         res.render('page/dash', {message: {title: "Message", text: "User signed in"}});
//     });
// }