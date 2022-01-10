# setup-npm

Quando trabalhamos com NodeJS, e ao criarmos um novo projeto, existe sempre aquelas configurações que são básicas para configuração do ambiente, como a instalação de packages de  desenvolvimento como nodemon, eslint, prettier etc...... e de certa forma perdemos tempo fazendo o setup no vscode do novo projeto.
Podemos otimizar essas tarefas fazendo que ao criar um novo projeto com o comando npm init , ja seja criado um novo projeto com todas as dependencias e configurações que voce use.

Abra o terminal e execute o comando:</br>

```npm config ls -l ```

Esse comando listará todas as configurações da sua instalação NPM procure por <b>init.module<b> e observe qual é o diretorio que esta apontando para o arquivo <b>.npm-init.js<b>
 

![image](https://user-images.githubusercontent.com/30879448/148273079-3c61ba5f-2dd1-4399-8377-308ff60907be.png)
  
 Em ambiente Windows geralmente o diretorio padrão é a pasta de usuario, caso queira alterar o diretorio pode usar o comando: </br>
  
  ``` npm config set init-module novo_diretorio/.npm-init.js```</br>
  
  Lembrando que no Windows deve ser informado duas contra barras \\\
  exemplo:
  ```npm config set init-module D:\\projetos\\configuracao\\.npm-init.js```</br>
  
  Uma vez definido o diretorio, deve-se criar o arquivo <b>.npm-init.js<b> com o seguinte conteúdo:</br>
 
 ```
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
*.lock
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

if (!exists('LICENSE')) {
  // escreve o arquivo
  fs.writeFileSync('LICENSE', content_license);
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
if (!exists('.vscode/extensions.json')) {
  // escreve o arquivo extensions.json dentro da pasta .vscode
  fs.writeFileSync('.vscode/extensions.json', content_extensions);
}
if (!exists('.vscode/settings.json')) {
  // escreve o arquivo settings.json dentro da pasta .vscode
  fs.writeFileSync('.vscode/settings.json', content_settings);
}

// abaixo é montado o arquivo package.json altere conforme sua necessidade

var baseData = {
  name: prompt('name', basename || package.name),
  version: '0.0.1',
  description: prompt((s) => s),
  main: prompt('entry point', 'index.js', (ep) => fs.writeFileSync(ep, '')),
  author: 'Eduardo Policarpo',
  license: 'Apache-2.0',
  scripts: {
    start: 'node index.js',
    dev: 'nodemon index.js',
  },
  repository: {
    type: 'git',
    url: `git://github.com/${user}/${basename}.git`,
  },
  bugs: { url: `https://github.com/${user}/${basename}/issues` },
  homepage: `https://github.com/${user}/${basename}#readme`,
  keywords: prompt((s) => s.split(/\s+/)),
  devDependencies: {
    eslint: '*',
    'eslint-config-airbnb': '*',
    'eslint-config-node': '*',
    'eslint-config-prettier': '*',
    'eslint-plugin-import': '*',
    'eslint-plugin-jsx-a11y': '*',
    'eslint-plugin-node': '*',
    'eslint-plugin-prettier': '*',
    'eslint-plugin-react': '*',
    'eslint-plugin-react-hooks': '*',
    prettier: '*',
    nodemon: '*',
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
        `curl -i -H "Authorization: token ${github_token}" -d "{\"name\":\"blog\", \"auto_init\": \"true\", \"private\": \"true\", \"gitignore_template\": \"nanoc\"}" https://api.github.com/user/repos`,
        //`curl -u ${user}:${github_token} -X POST -H "Accept: application/vnd.github.v3+json" https://api.github.com/user/repos --data-raw "{\"name\":\"teste123\",\"auto_init\":\"true\",\"private\":\"false\"}"`,
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

 ```
 
 
 Pronto agora sempre que voce criar um novo projeto NodeJS com o npm init já vai ficar com todas as configurações defina</br>
 
 
 ![image](https://user-images.githubusercontent.com/30879448/148413753-9b0351e3-2bca-407d-a92b-0aef80e42c02.png)

 
