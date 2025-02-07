import { ErrorType } from "./ErrorType";

export default class AppError extends Error
{
    title     : string;
    errorPage : string;
    errorType : ErrorType;

    constructor(message: string, title : string = 'Error', errorPage: string = 'page/error')
    {
        super(message);
        this.title      = title;
        this.errorPage  = errorPage;
        this.errorType  = ErrorType.Error;
    }

    toString(): string
    {
        return `${this.title} - ${this.message} ${this.errorPage ? 'errorPage:'+this.errorPage : ''}`;
    }
}