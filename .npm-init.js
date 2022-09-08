/*##############################################################################
# File: setup-npm.js                                                           #
# Project: fatalmodel                                                          #
# Created Date: 2022-01-08 21:24:45                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-07-15 08:54:13                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const fs = require('fs');
const cp = require('child_process');
var gitUser = cp.execSync('git config user.name').toString().replace('\n', '');
var user = gitConfigUser() || gitUser || 'USER';
var github_token = 'COLOQUE-SEU-TOKEN-AQUI';

// conteudo do arquivo de licença
const content_license = `
Copyright 2016 Red Hat, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in fs.writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
`;

// conteudo que sera criado o arrquivo .dockerignore
const content_dockerignore= `
# ignore .git and .cache folders
.cache*

# ignore all *.class files in all folders, including build root
**/*.class

# ignore all markdown files (md) beside all README*.md other than README-secret.md
*.md
!README*.md
README-secret.md

# ignore
*Dockerfile*
*docker-compose*
node_modules
.env*
tokens
logs
`;

// conteudo que sera criado o arquivo .editorconfig
const content_editorconfig = `
root = true

[*]
end_of_line = lf
insert_final_newline = true
charset = utf-8

[{package.json}]
indent_style = space
indent_size = 2
`;

// conteudo que sera criado o arquivo .env
const content_env = `
PORT = 3000
HOST=localhost
SENTRY_DSN=
`;

// conteudo que sera criado o arquivo tsconfig.json
const content_tsconfig = `{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "sourceMap": false,
    "typeRoots": ["src/types"]
  }
}`;

//conteudo que será criado o arquivo .eslintrc.json
const content_eslint = `{ 
  "extends": ["airbnb", "prettier", "plugin:prettier/recommended"],
  "parser": "@typescript-eslint/parser",
  "plugins": ["prettier", "@typescript-eslint"],
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "prettier/prettier": "error",
    "no-unused-vars": "warn",
    "no-console": "off",
    "func-names": "off",
    "no-process-exit": "off",
    "object-shorthand": "off",
    "class-methods-use-this": "off",
    "camelcase": "off"
  }
}`;
//conteudo que será criado o arquivo .prettierrc
const content_prettier = `{
  "singleQuote": true
}`;
//conteudo que será criado o arquivo .prettierignore
const content_prettier_ignore = `
  dist
  html
`;
//conteudo que será criado o arquivo .gitignore
const content_gitignore = `
  node_modules
  dist
  logs
  tokens
  .DS_Store
`;
//conteudo que será criado o arquivo nodemon.json
const content_nodemon = `{
  "restartable": "rs",
  "ignore": [
    ".git",
    "node_modules/",
    "tokens"
  ]
}`;
//conteudo que será criado o arquivo extensions.json
const content_extensions = `{
  // List of extensions which should be recommended for users of this workspace.
  "recommendations": ["dbaeumer.vscode-eslint", "esbenp.prettier-vscode"]
}`;
//conteudo que será criado o arquivo settings.json
const content_settings = `{
  "editor.formatOnSave": true,
  "[javascript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "[typescript]": {
      "editor.defaultFormatter": "esbenp.prettier-vscode"
    }
}`;

// conteudo do arquivo app.ts
const content_app = `
/*##############################################################################
# File: app.ts                                                                 #
# Project: name                                                                #
# Created Date: 2022-08-06 01:43:43                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-08-23 23:52:38                                           #
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
      `Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}`'
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
`;

// conteudo do arquivo config.ts
const content_config = `
/*##############################################################################
# File: config.ts                                                              #
# Project: name                                                                #
# Created Date: 2022-06-13 21:47:30                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-08-27 21:27:22                                           #
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
`;

// conteudo do arquivo routers
const content_index = `
/*##############################################################################
# File: index.ts                                                               #
# Project: name                                                                #
# Created Date: 2022-05-14 18:58:30                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-04 19:56:55                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

import { Router } from 'express';
export const router = Router();
`;

// conteudo do arquivo logger.ts
const content_logger = `
/* ##############################################################################
# File: logger.ts                                                              #
# Project: nome                                                                #
# Created Date: 2022-05-08 11:13:18                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-05-08 11:13:37                                           #
# Modified By: Eduardo Policarpo                                               #
############################################################################## */

import { existsSync, mkdirSync } from 'fs';
import { resolve } from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

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
    new winstonDaily({
      level: 'debug',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/debug',
      filename: `%DATE%.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
    }),

    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: logDir + '/error',
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
`;

// conteudo do arquivo index.ts 
const content_utils_index = `
/* ##############################################################################
# File: index.ts                                                               #
# Project: api-whatsapp                                                        #
# Created Date: 2022-05-15 15:14:21                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-05-15 15:19:55                                           #
# Modified By: Eduardo Policarpo                                               #
############################################################################## */

export * from './logger';
`;

if (!exists('LICENSE')) {
  // escreve o arquivo
  fs.writeFileSync('LICENSE', content_license);
}

if (!exists('.dockerignore')) {
  // escreve o arquivo
  fs.writeFileSync('.dockerignore', content_dockerignore);
}

if (!exists('.editorconfig')) {
  // escreve o arquivo
  fs.writeFileSync('.editorconfig', content_editorconfig);
}

if (!exists('.env')) {
  // escreve o arquivo
  fs.writeFileSync('.env', content_env);
}

if (!exists('.tsconfig.json')) {
  // escreve o arquivo
  fs.writeFileSync('.tsconfig.json', content_tsconfig);
}

if (!exists('.eslintrc.json')) {
  // escreve o arquivo
  fs.writeFileSync('.eslintrc.json', content_eslint);
}
if (!exists('.prettierrc')) {
  // escreve o arquivo
  fs.writeFileSync('.prettierrc', content_prettier);
}
if (!exists('.prettierignore')) {
  // escreve o arquivo
  fs.writeFileSync('.prettierignore', content_prettier_ignore);
}
if (!exists('.gitignore')) {
  // escreve o arquivo
  fs.writeFileSync('.gitignore', content_gitignore);
}
if (!exists('nodemon.json')) {
  // escreve o arquivo
  fs.writeFileSync('nodemon.json', content_nodemon);
}
if (!exists('.vscode')) {
  // cria a pasta .vscode
  fs.mkdirSync('.vscode');
}

if (!exists('src')) {
  // cria a pasta src
  fs.mkdirSync('src');
}

if (!exists('src/routers')) {
  // cria a pasta routers
  fs.mkdirSync('src/routers');
}

if (!exists('src/utils')) {
  // cria a pasta utils
  fs.mkdirSync('src/utils');
}

if (!exists('.vscode/extensions.json')) {
  // escreve o arquivo extensions.json dentro da pasta .vscode
  fs.writeFileSync('.vscode/extensions.json', content_extensions);
}
if (!exists('.vscode/settings.json')) {
  // escreve o arquivo settings.json dentro da pasta .vscode
  fs.writeFileSync('.vscode/settings.json', content_settings);
}

if (!exists('src/app.ts')) {
  // escreve o arquivo app.ts dentro da pasta src
  fs.writeFileSync('src/app.ts', content_app);
}

if (!exists('src/config.ts')) {
  // escreve o arquivo config.ts dentro da pasta src
  fs.writeFileSync('src/config.ts', content_config);
}

if (!exists('src/routers/index.ts')) {
  // escreve o arquivo index.ts dentro da pasta routers
  fs.writeFileSync('src/routers/index.ts', content_index);
}

if (!exists('src/utils/logger.ts')) {
  // escreve o arquivo logger.ts dentro da pasta utils
  fs.writeFileSync('src/utils/logger.ts', content_logger);
}

if (!exists('src/utils/index.ts')) {
  // escreve o arquivo index.ts dentro da pasta utils
  fs.writeFileSync('src/utils/index.ts', content_utils_index);
}

// abaixo é montado o arquivo package.json altere conforme sua necessidade

var baseData = {
  name: prompt('name', basename || package.name),
  version: '0.0.1',
  description: prompt((s) => s),
  main: prompt('entry point', 'app.js', (ep) => fs.writeFileSync(ep, '')),
  author: 'Eduardo Policarpo',
  license: 'Apache-2.0',
  scripts: {
    build: 'tsc -p .',
    dev: 'ts-node-dev --inspect --ignore-watch node_modules src/app.ts',
    clean: 'shx rm -rf dist',
    lint: 'npx eslint --ext .ts src',
    start: 'node ./dist/app.js',
    watch: 'tsc -w',
    test: 'npx autocannon --renderStatusCode -d 10 -c 1000  localhost:3000'
  },
  repository: {
    type: 'git',
    url: `git://github.com/${user}/${basename}.git`,
  },
  bugs: { url: `https://github.com/${user}/${basename}/issues` },
  homepage: `https://github.com/${user}/${basename}#readme`,
  keywords: prompt((s) => s.split(/\s+/)),
  dependencies: {
    'cors': 'latest',
    'dotenv': 'latest',
    'dotenv-expand': 'latest',
    'envalid': 'latest',
    'express': 'latest',
    'helmet': 'latest',
    'morgan': 'latest',
    'winston': 'latest',
    'winston-daily-rotate-file': 'latest'
  },
  devDependencies: {
    '@commitlint/cli': 'latest',
    '@commitlint/config-conventional': 'latest',
    '@commitlint/prompt-cli': 'latest',
    '@types/axios': 'latest',
    '@types/cors': 'latest',
    '@types/express': 'latest',
    '@types/express-ejs-layouts': 'latest',
    '@types/morgan': 'latest',
    '@types/node': 'latest',
    '@typescript-eslint/eslint-plugin': 'latest',
    'autocannon': 'latest',
    'eslint': 'latest',
    'eslint-config-airbnb': 'latest',
    'eslint-config-airbnb-typescript': 'latest',
    'eslint-config-prettier': 'latest',
    'eslint-plugin-prettier': 'latest',
    'eslint-prettier': 'latest',
    'nodemon': 'latest',
    'prettier': 'latest',
    'prettier-quick': 'latest',
    'shx': 'latest',
    'ts-node-dev': 'latest',
    'typescript': 'latest'
  },
};

function exists(name) {
  try {
    fs.statSync(name);
    return true;
  } catch (e) {
    return false;
  }
}

function gitConfigUser() {
  var user = '';
  if (exists('.git/config')) {
    var content = readFileSync('.git/config').toString().split('\n');
    var remoteFound = false;
    for (var i = 0; i < content.length; i++) {
      if (content[i] === '[remote "origin"]') {
        remoteFound = true;
        break;
      }
    }
    if (remoteFound) {
      for (var i = 0; i < content.length; i++) {
        if (content[i] === '[remote "origin"]') {
          user = content[++i].split(':')[1].split('/')[0];
          break;
        }
      }
    }
  }
  return user;
}

var customizedData = {};
Object.assign(customizedData, baseData);

customizedData.gitUser = prompt(
  'Deseja Criar repositório no github para esse projeto ?',
  'yes/no',
  (val) => {
    val = val.indexOf('y') !== -1;
    if (val) {
      cp.exec(
        `curl -u ${user}:${github_token} https://api.github.com/user/repos -d '{"name":${basename}}'`,
        //`curl -i -H "Authorization: token ${github_token}" -d "{\"name\":\"blog\", \"auto_init\": \"true\", \"private\": \"true\", \"gitignore_template\": \"nanoc\"}" https://api.github.com/user/repos`,
        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`);
          }
          if (stdout) {
            console.log(`stderr: ${stdout}`);
          }
        }
      );
    }
  }
);

module.exports = customizedData;
