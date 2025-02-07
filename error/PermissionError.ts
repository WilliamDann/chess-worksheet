import AppError from "./AppError";

export default class PermissionError extends AppError
{
    constructor(message: string = "You do not have permission to preform this action", title : string = 'Permission Error', errorPage: string = 'page/error')
    {
        super(message, title);
    }
}