/*##############################################################################
# File: setup-npm.js                                                           #
# Project: setup-npm                                                           #
# Created Date: 2022-01-08 21:24:45                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2022-09-08 17:03:23                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

const fs = require('fs');
const cp = require('child_process');
var user = gitConfigUser() || 'USER';
var github_token = 'COLOQUE-SEU-TOKEN-AQUI';
var language = 'typescript'; // defina se ira utilizar javascript ou typescript

if (!exists('.git')) {
  cp.execSync('git init');
}

const dirPath =
  language == 'typescript'
    ? `${__dirname}/Modelos-NPM/typescript`
    : `${__dirname}/Modelos-NPM/javascript`;

if (!exists('LICENSE')) {
  fs.copyFileSync(`${dirPath}/LICENSE`, 'LICENSE');
}

if (!exists('Dockerfile')) {
  fs.copyFileSync(`${dirPath}/Dockerfile`, 'Dockerfile');
}

if (!exists('.dockerignore')) {
  fs.copyFileSync(`${dirPath}/.dockerignore`, '.dockerignore');
}

if (!exists('.editorconfig')) {
  fs.copyFileSync(`${dirPath}/.editorconfig`, '.editorconfig');
}

if (!exists('.env')) {
  fs.copyFileSync(`${dirPath}/.env`, '.env');
}

if (!exists('tsconfig.json')) {
  fs.copyFileSync(`${dirPath}/tsconfig.json`, 'tsconfig.json');
}

if (!exists('.eslintrc.json')) {
  fs.copyFileSync(`${dirPath}/.eslintrc.json`, '.eslintrc.json');
}

if (!exists('.prettierrc')) {
  fs.copyFileSync(`${dirPath}/.prettierrc`, '.prettierrc');
}

if (!exists('.prettierignore')) {
  fs.copyFileSync(`${dirPath}/.prettierignore`, '.prettierignore');
}

if (!exists('.gitignore')) {
  fs.copyFileSync(`${dirPath}/.gitignore`, '.gitignore');
}

if (!exists('nodemon.json')) {
  fs.copyFileSync(`${dirPath}/nodemon.json`, 'nodemon.json');
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
  fs.copyFileSync(`${dirPath}/extensions.json`, '.vscode/extensions.json');
}
if (!exists('.vscode/settings.json')) {
  fs.copyFileSync(`${dirPath}/settings.json`, '.vscode/settings.json');
}

if (!exists('src/app.ts')) {
  fs.copyFileSync(`${dirPath}/app.ts`, 'src/app.ts');
}

if (!exists('src/config.ts')) {
  fs.copyFileSync(`${dirPath}/config.ts`, 'src/config.ts');
}

if (!exists('src/routers/index.ts')) {
  fs.copyFileSync(`${dirPath}/index_routers.ts`, 'src/routers/index.ts');
}

if (!exists('src/utils/logger.ts')) {
  fs.copyFileSync(`${dirPath}/logger.ts`, 'src/utils/logger.ts');
}

if (!exists('src/utils/index.ts')) {
  fs.copyFileSync(`${dirPath}/index_utils.ts`, 'src/utils/index.ts');
}

// abaixo é montado o arquivo package.json altere conforme sua necessidade

var baseData = {
  name: prompt('name', basename || package.name),
  version: '0.0.1',
  description: prompt((s) => s),
  main: prompt('entry point', 'index.js', (ep) => fs.writeFileSync(ep, '')),
  main: 'dist/app.js',
  author: 'Eduardo Policarpo',
  license: 'Apache-2.0',
  scripts: {
    build: 'tsc -p .',
    dev: 'ts-node-dev --inspect --ignore-watch node_modules src/app.ts',
    clean: 'shx rm -rf dist',
    lint: 'npx eslint --ext .ts src',
    start: 'node ./dist/app.js',
    watch: 'tsc -w',
    test: 'npx autocannon --renderStatusCode -d 10 -c 1000  localhost:3000',
  },
  repository: {
    type: 'git',
    url: `git://github.com/${user}/${basename}.git`,
  },
  bugs: { url: `https://github.com/${user}/${basename}/issues` },
  homepage: `https://github.com/${user}/${basename}#readme`,
  keywords: prompt((s) => s.split(/\s+/)),
  dependencies: {
    '@sentry/integrations': 'latest',
    '@sentry/node': 'latest',
    cors: 'latest',
    dotenv: 'latest',
    'dotenv-expand': 'latest',
    envalid: 'latest',
    express: 'latest',
    helmet: 'latest',
    morgan: 'latest',
    winston: 'latest',
    'winston-daily-rotate-file': 'latest',
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
    autocannon: 'latest',
    eslint: 'latest',
    'eslint-config-airbnb': 'latest',
    'eslint-config-airbnb-typescript': 'latest',
    'eslint-config-prettier': 'latest',
    'eslint-plugin-prettier': 'latest',
    'eslint-prettier': 'latest',
    nodemon: 'latest',
    prettier: 'latest',
    'prettier-quick': 'latest',
    shx: 'latest',
    'ts-node-dev': 'latest',
    typescript: 'latest',
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
    var content = fs.readFileSync('.git/config').toString().split('\n');
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
        `curl -X POST -H "Accept: application/vnd.github+json" -H "Authorization: Bearer ${github_token}" --data '{"name":"${basename}"}' https://api.github.com/user/repos`,

        (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`);
            return;
          }
        }
      );
    }
  }
);

module.exports = customizedData;
