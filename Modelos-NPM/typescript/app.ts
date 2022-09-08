/*##############################################################################
# File: app.ts                                                                 #
# Project: typescript                                                          #
# Created Date: 2022-09-08 13:46:05                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-08 15:23:58                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import cluster from 'cluster';
import os from 'os';
const numCPUs = os.cpus().length;
import express, { Request, Response, NextFunction } from 'express';
import * as Sentry from '@sentry/node';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { router } from './routers';
import { PORT, SENTRY_DSN } from './config';
import { logger, stream } from './utils';
import http from 'http';

if (cluster.isPrimary) {
  console.log('Master process is running');
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`
    );
    console.log('Starting a new worker');
    cluster.fork();
  });
} else {
  const app = express();
  const server = http.createServer(app);
  Sentry.init({ dsn: SENTRY_DSN });
  app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
  app.use(morgan('combined', { stream }));
  app.use(helmet());
  app.use(express.json({ strict: false, limit: '100mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: '*' }));
  app.use(router);

  app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);

  server.listen(PORT, async () => {
    logger.info(
      `🚀 App running on the process pid: ${process.pid} and listening on port ${PORT}`
    );
  });

  process.on('unhandledRejection', (error) => {
    logger.error(`\nunhandledRejection signal received. \n${error}`);
  });

  function grafulShutdown(event: any) {
    return (code: any) => {
      logger.info(`${event} received! with ${code}`);
      server.close(() => {
        logger.info('Server terminated successfully');
        process.exit(code);
      });
    };
  }

  process.on('SIGINT', grafulShutdown('SIGINT'));
  process.on('SIGTERM', grafulShutdown('SIGTERM'));

  process.on('exit', (code) => {
    logger.info('exit signal received', code);
  });
}
