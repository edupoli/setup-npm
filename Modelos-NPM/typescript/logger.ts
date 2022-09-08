/*##############################################################################
# File: logger.ts                                                              #
# Project: typescript                                                          #
# Created Date: 2022-09-08 13:50:42                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-08 13:50:47                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const logDir: string = resolve(process.cwd(), './logs');

if (!existsSync(logDir)) {
  mkdirSync(logDir);
}

const logFormat = winston.format.printf(
  ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
);

/*
 * Log Level
 * error: 0, warn: 1, info: 2, http: 3, verbose: 4, debug: 5, silly: 6
 */
const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    logFormat
  ),
  transports: [
    new WinstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/debug`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),

    new WinstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.log`,
      maxFiles: 30,
      handleExceptions: true,
      json: false,
      zippedArchive: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.splat(),
      winston.format.colorize()
    ),
  })
);

const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};

export { logger, stream };
