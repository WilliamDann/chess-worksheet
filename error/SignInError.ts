import AppError from "./AppError";
import { ErrorType } from "./ErrorType";

export default class SignInError extends AppError
{
    constructor(message: string = "Please sign in to preform this action", title : string = 'Sign In Error')
    {
        super(message, title, 'user/auth');
        this.errorType = ErrorType.Message;
    }
}