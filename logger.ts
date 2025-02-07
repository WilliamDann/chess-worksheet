import { createLogger, format, transports } from "winston";
import Env from "./env";

export default function()
{
    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.errors({ stack: true }),
            format.splat(),
            format.simple()
        ),
        defaultMeta: { service: 'chessbook' },
        transports: [
            //
            // - Write to all logs with level `info` and below to `quick-start-combined.log`.
            // - Write all logs error (and below) to `quick-start-error.log`.
            //
            new transports.File({ filename: 'application-error.log', level: 'error' }),
            new transports.File({ filename: 'application-combined.log' })
        ]
    });
    
    Env.instance().logger = logger;

    logger.info('## LOGGER STARTED ######################################### ');
}