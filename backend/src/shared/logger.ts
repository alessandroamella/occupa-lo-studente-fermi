import path from "path";
import { createLogger, format, transports } from "winston";

const {
    combine,
    timestamp,
    colorize,
    errors,
    label,
    printf,
    splat,
    json,
    metadata
} = format;

const combinedLogsFile = path.join("./logs/combined.log");
const errorsLogsFile = path.join("./logs/error.log");

const errorStackFormat = format(info => {
    if (info instanceof Error) {
        return Object.assign({}, info, {
            stack: info.stack,
            message: info.message
        });
    }
    return info;
});

const prettyJson = printf(info => {
    if (info?.message?.constructor && info.message.constructor === Object) {
        info.message = JSON.stringify(info.message, null, 4);
    }
    return `${info.level}: ${info.message}`;
});

export const logger = createLogger({
    // change level if in dev environment versus production
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format: combine(
        label({ label: path.basename(require.main?.filename || "") }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        errorStackFormat(),
        metadata({ fillExcept: ["message", "level", "timestamp", "label"] })
    ),
    transports: [
        new transports.Console({
            format: combine(
                colorize(),
                printf(
                    info =>
                        `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                ),
                errorStackFormat(),
                splat(),
                prettyJson
            )
        }),
        new transports.File({
            filename: combinedLogsFile,
            format: combine(
                json(),
                errors(),
                errorStackFormat(),
                json(),
                timestamp()
            ),
            maxsize: 10000000
        }),
        new transports.File({
            filename: errorsLogsFile,
            level: "error",
            format: combine(
                json(),
                errors(),
                errorStackFormat(),
                json(),
                timestamp()
            ),
            maxsize: 20000000
        })
    ]
});

export class LoggerStream {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    write(message: string, encoding?: string) {
        logger.info(message);
    }
}
