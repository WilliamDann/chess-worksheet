import AppError from "./AppError";

export class ItemMissingError extends AppError
{
    constructor(message: string = "The item requested was not found", title : string = 'Item Not Found', errorPage: string = 'page/error')
    {
        super(message, title, errorPage);
    }
}
