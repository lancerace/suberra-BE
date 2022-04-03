import winston, { format } from 'winston';


export default winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: format.combine(format.colorize({ all: true }))
        }),
        new winston.transports.File({
            filename: process.env.LOG_FILE_PATH
        })
    ],
    format: winston.format.combine(
        winston.format.timestamp({ format: 'ZZ MMM-DD-YYYY HH:mm' }),
        winston.format.printf(info => `[${info.level}] [${[info.timestamp]}]: ${info.message}`),
    )
})