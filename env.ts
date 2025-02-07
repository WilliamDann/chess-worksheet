import { Application } from "express";
import { Connection }  from "mysql";
import { Logger }      from "winston";

export enum ServerMode
{
    Production,
    Development
}

export default class Env
{
    static #instance: Env;

    private _app    ?: Application;
    private _db     ?: Connection;
    private _logger ?: Logger;

    private _mode   ?: ServerMode;

    private constructor() {

    };

    public static instance(): Env {
        if (!Env.#instance) {
            Env.#instance = new Env();
        }
        return Env.#instance;
    }

    get app(): Application
    {
        if (!this._app)
            throw new Error("App not created");
        return this._app;
    }

    set app(app: Application)
    {
        this._app = app;
    }

    get db(): Connection
    {
        if (!this._db)
            throw new Error("DB not created");
        return this._db;
    }

    get logger(): Logger
    {
        if (!this._logger)
            throw new Error("Logger not created")
        return this._logger;
    }
    
    set db(db: Connection)
    {
        this._db = db;
    }

    get mode(): ServerMode
    {
        if (!this._mode)
            throw Error("Mode not set");
        return this._mode
    }

    set mode(mode: ServerMode)
    {
        this._mode = mode;
    }

    set logger(logger: Logger)
    {
        this._logger = logger;
    }
}