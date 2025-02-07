import AppError from "./AppError";

export default class InvalidRequestError extends AppError
{
    constructor(message: string, title : string = 'Invalid Request', errorPage: string = 'page/error')
    {
        super(message, title, errorPage);
    }
}