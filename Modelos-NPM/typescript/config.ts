/*##############################################################################
# File: config.ts                                                              #
# Project: typescript                                                          #
# Created Date: 2022-09-08 13:48:25                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-08 13:48:34                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { cleanEnv, num, str } from 'envalid';

expand(config({ path: `.env` }));
expand(config({ path: `.env.local` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}` }));
expand(config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` }));
expand(config());

const env = cleanEnv(process.env, {
  NODE_ENV: str({ default: 'development' }),
  PORT: num({ default: 3000 }),
  HOST: str({ default: '' }),
  SENTRY_DSN: str({ default: '' }),
});

const { NODE_ENV, PORT, HOST, SENTRY_DSN } = env;
export { NODE_ENV, PORT, HOST, SENTRY_DSN };
