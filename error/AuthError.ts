import AppError from "./AppError";

export default class AuthError extends AppError
{
    constructor(title : string = 'Invalid Request', message: string = "Could not auth user", errorPage: string = 'user/auth')
    {
        super(message, title, errorPage);
    }
}