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
  
  Uma vez definido o diretorio deve ser criado o arquivo <b>.npm-init.js<b> com o seguinte conteúdo:</br>
