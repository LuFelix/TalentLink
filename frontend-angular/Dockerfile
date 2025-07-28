# # Build da imagem base com Node.js
# FROM node:18-bookworm-slim

# # Ferramentas de Depuração
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends \
#     procps \
#     net-tools \
#     iproute2 \
#     lsof \
#     && rm -rf /var/lib/apt/lists*	


# # Criar usuário node e diretório com permissões adequadas
# RUN mkdir -p /usr/src/app && chown -R node:node /usr/src/app
#     #mkdir -p /home/node/.cache && \
#     #mkdir -p /usr/src/app/.angular && \
#     #chown -R node:node /usr/src/app && \
#     #chown -R node:node /home/node/.cache && \
#     #chown -R node:node /usr/src/app/.angular

# # Diretório de trabalho dentro do container
# WORKDIR /usr/src/app

# # Instalar Angular CLI globalmente como root, antes de mudar de usuário
# RUN npm install -g @angular/cli

# #Trocar para usuário node
# USER node

# # Copiar apenas os arquivos essenciais primeiro
# COPY --chown=node:node package*.json ./
# #COPY --chown=node:node tailwind.config.js ./
# #COPY --chown=node:node postcss.config.js ./

# # incluindo Tailwind CSS, PostCSS e Autoprefixer.
# #RUN npm install && npm install -D tailwindcss@3.4.1 postcss autoprefixer

# # Instalar dependências (Tailwind)
# RUN npm install && npm install @angular/material@19.2.0 @angular/cdk@19.2.0

# #Instalar as dependências do projeto
# #RUN npm install

# # Copiar o restante do projeto
# COPY --chown=node:node . .

# #Definindo as permissões corretas
# #RUN chown -R node:node /usr/src/app


# # Expor a porta padrão do Angular
# EXPOSE 4200

# # Comando de inicialização (será substituído pelo docker-compose, mas é bom para contexto)
# CMD ["npm", "run", "start"]

FROM node:18-bookworm-slim

# 1. Instalação de ferramentas essenciais
RUN apt-get update && apt-get install -y \
    procps net-tools && \
    rm -rf /var/lib/apt/lists/*

# 2. Configuração de usuário e diretórios
RUN mkdir -p /usr/src/app && \
    chown -R node:node /usr/src/app

WORKDIR /usr/src/app

# 3. Copiar arquivos de configuração como usuário node
COPY --chown=node:node package*.json ./

# 4. Instalação segura de dependências
USER node
RUN npm install --unsafe-perm && \
    npm cache clean --force

# 5. Copiar o restante da aplicação
COPY --chown=node:node . .

EXPOSE 4200

# 6. Comando de inicialização otimizado
CMD ["npm", "start"]
