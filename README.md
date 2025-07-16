# Projeto Monorepo (Backend NestJS + Frontend Angular) com Docker e WSL2

Este repositório contém um setup para desenvolvimento de aplicações web utilizando NestJS no backend e Angular no frontend, orquestradas com Docker Compose no ambiente WSL2.

---

## 🚀 Como Iniciar o Projeto

Siga estes passos para configurar e iniciar seu ambiente de desenvolvimento.

### 1. Configuração Inicial do Ambiente (Pré-requisitos no WSL2)

Certifique-se de que seu ambiente WSL2 possui as seguintes ferramentas instaladas:

* **Git:**
    ```bash
    git --version
    ```
* **Docker Desktop com WSL Integration:** Instale o Docker Desktop no Windows e certifique-se de que a integração com seu subsistema WSL2 está habilitada.
    * Verifique:
        ```bash
        docker --version
        docker compose version
        ```
* **Node.js e NPM (Recomendado via NVM - Node Version Manager):**
    É altamente recomendado usar o [NVM](https://github.com/nvm-sh/nvm) para gerenciar suas versões do Node.js.
    * **Instalar NVM:**
        ```bash
        curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh) | bash
        ```
        *Após a instalação do NVM, **feche e reabra o terminal WSL** para que as alterações surtam efeito.*
    * **Instalar Node.js v18 (e definir como padrão):**
        ```bash
        nvm install 18
        nvm use 18
        nvm alias default 18
        ```
    * **Verifique a instalação:**
        ```bash
        node -v
        npm -v
        ```
* **CLIs Globais do Node.js:** Necessárias para os comandos `nest new` e `ng new`.
    ```bash
    npm install -g @nestjs/cli
    npm install -g @angular/cli
    ```
    * Verifique: `nest --version` e `ng --version`

### 2. Setup do Projeto

Uma vez que todos os pré-requisitos estão instalados no seu ambiente WSL2:

1.  **Clone o repositório:**
    ```bash
    git clone [URL_DO_REPOSITORIO]
    cd nome-do-projeto
    ```
2.  **Torne o script de setup executável:**
    Este passo é necessário apenas uma vez após clonar o repositório.
    ```bash
    chmod +x setup_project.sh
    ```
3.  **Execute o script de setup:**
    Este script irá criar as estruturas iniciais dos projetos NestJS e Angular (se não existirem) e, em seguida, construirá e subirá os serviços Docker.
    ```bash
    ./setup_project.sh
    ```
4.  **Acesse as Aplicações:**
    * **Backend (NestJS):** Acesse em seu navegador via `http://localhost:3000`
    * **Frontend (Angular):** Acesse em seu navegador via `http://localhost:4200`

## 📁 Estrutura do Projeto

```
nome-do-projeto/
│
├── .devcontainer/ # Arquivos para VS Code DevContainer opcional da raiz (global)
│ ├── devcontainer.json
│ └── docker-compose.yml → ../docker-compose.yml (link simbólico)
│
├── backend-nest/         # Serviço NestJS
│   ├── .devcontainer/
│   ├── Dockerfile
│   └── README.md
│
├── frontend-angular/     # Serviço Angular
│   ├── .devcontainer/
│   ├── Dockerfile
│   └── README.md
│
├── mysql-data/           # Volume persistente para banco de dados
├── infra/                # Configurações adicionais
├── .gitignore
├── .dockerignore
├── docker-compose.yml    # Orquestração dos serviços
├── README.md             # Este arquivo
└── ...
```

### 3. Desenvolvimento com VS Code Dev Containers (Opcional, mas Recomendado)

Para uma experiência de desenvolvimento integrada e isolada:

1.  Com o Docker Desktop rodando e os contêineres iniciados (`docker compose up -d`), abra o VS Code.
2.  Vá em `File > Open Folder...` e selecione a pasta `nome-do-projeto` no seu WSL.
3.  O VS Code deverá detectar a configuração `.devcontainer` e perguntar se você deseja "Reopen in Container". Confirme.
4.  Isso abrirá uma nova janela do VS Code diretamente dentro do contêiner, com todas as ferramentas e extensões já configuradas, e o código-fonte montado via volume.

---

### 4. Resolução de Problemas Comuns

#### 4.1. `Command 'npm' not found` ou `Command 'nest'/'ng' not found` no WSL

* **Causa:** Node.js/NPM ou as CLIs do Nest/Angular não estão instaladas globalmente no seu ambiente WSL.
* **Solução:** Siga os passos da seção **"Pré-requisitos"** para instalar NVM, Node.js, NPM e as CLIs globais no seu WSL. Lembre-se de fechar e reabrir o terminal após instalar o NVM.

#### 4.2. `Error: ENOENT: no such file or directory, open '/usr/src/app/package.json'`

* **Causa:** O `package.json` (e o restante do código-fonte do projeto) não existe no diretório local do seu WSL (`./backend-nest` ou `./frontend-angular`) que está sendo montado como volume no contêiner. Isso significa que os comandos `nest new` ou `ng new` não criaram os projetos corretamente.
* **Solução:**
    1.  Verifique se `npm`, `nest` e `ng` estão instalados globalmente no seu WSL (conforme "Pré-requisitos").
    2.  Assegure-se de que o script `setup_project.sh` está sendo executado e que ele cria os projetos nas pastas corretas. Se as pastas de projeto já existirem, o script tenta recriá-las.
    3.  Confirme a existência do `package.json` nas pastas locais com `ls -la backend-nest/` e `ls -la frontend-angular/` no seu terminal WSL.

#### 4.3. `npm warn deprecated` ou `Error: Could not find the '@angular-devkit/build-angular:dev-server' builder's node package.`

* **Causa:** As dependências do projeto (`node_modules`) não estão sendo instaladas corretamente *dentro do contêiner* ou não estão disponíveis quando a aplicação tenta iniciar.
* **Solução:**
    1.  **Garanta `npm install` no Dockerfile:** Adicione `RUN npm install` nos `Dockerfile`s do backend e frontend, após o `COPY package*.json ./`. Isso garante que as dependências sejam instaladas durante a construção da imagem.
    2.  **Remova CLIs Globais dos Dockerfiles:** Remova `RUN npm install -g @nestjs/cli` e `RUN npm install -g @angular/cli` dos seus `Dockerfile`s, pois estas são ferramentas de host, não de execução da aplicação no contêiner.
    3.  **Limpe e Reconstrua:** Após qualquer alteração nos `Dockerfile`s ou `docker-compose.yml`, sempre execute:
        ```bash
        docker compose down -v # Para remover contêineres e volumes antigos
        docker compose build --no-cache # Para reconstruir imagens sem cache
        docker compose up --force-recreate -d # Para recriar contêineres
        ```
    4.  **Verifique Logs:** `docker compose logs backend` e `docker compose logs frontend` para identificar erros durante a instalação ou inicialização.

#### 4.4. Aplicação não acessível via `localhost` (ex: `localhost:3000` ou `localhost:4200`)

* **Causa:**
    1.  **Mapeamento de portas ausente ou incorreto** no `docker-compose.yml`.
    2.  A aplicação dentro do contêiner está ouvindo apenas em `localhost` (ou `127.0.0.1`) em vez de **`0.0.0.0`** (todas as interfaces).
* **Solução:**
    1.  **Verifique `ports` no `docker-compose.yml`:**
        Certifique-se de que as portas estão mapeadas:
        ```yaml
        ports:
          - "3000:3000" # Para backend
          - "4200:4200" # Para frontend
        ```
    2.  **Configure a aplicação para ouvir em `0.0.0.0`:**
        * **NestJS (backend - `src/main.ts`):** A linha `await app.listen(process.env.PORT ?? 3000);` geralmente já é suficiente, pois o NestJS por padrão ouve em `0.0.0.0`. Se houver um `listen(port, 'localhost')` explícito, mude para `listen(port, '0.0.0.0')`.
        * **Angular (frontend - `frontend-angular/package.json`):**
            Altere o script `start`:
            ```json
            "start": "ng serve --host 0.0.0.0 --disable-host-check",
            ```
    3.  **Reinicie o contêiner afetado:** `docker compose up <service_name> --force-recreate -d`

#### 4.5. `ERROR [NestApplication] Error: listen EADDRINUSE: address already in use :::3000`

* **Causa:** Isso significa que um processo dentro do contêiner já está usando a porta 3000 (ou 4200 para o Angular) quando outro processo tenta usá-la. Geralmente, acontece se você tentar iniciar a aplicação manualmente dentro do contêiner via `docker exec` *enquanto* ela já está rodando via `docker compose up`.
* **Solução:** Não é um problema se a primeira instância da sua aplicação já está rodando e acessível. Apenas evite iniciar a aplicação novamente manualmente dentro de um contêiner já em execução que já está usando a porta. Se o erro ocorrer na inicialização do contêiner, verifique se não há instâncias antigas ou travadas que não foram limpas (use `docker compose down -v` antes de `up`).

---

### Próximos Passos

Agora que seu ambiente está configurado e ambos os contêineres estão funcionando e acessíveis, os próximos passos são:

1.  **Testar a Comunicação Entre os Contêineres:**
    Verificar se o frontend consegue fazer requisições para o backend. Isso envolve configurar o Angular para apontar para o serviço NestJS usando o nome do serviço do Docker Compose (`http://backend:3000`).

2.  **Criar uma Landing Page:**
    Começar a desenvolver seu frontend Angular.