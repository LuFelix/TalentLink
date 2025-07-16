# Build da imagem base com Node.js
FROM node:18-bookworm-slim

# Ferramentas de Depuração
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    procps \
    net-tools \
    iproute2 \
    lsof \
    && rm -rf /var/lib/apt/lists*	

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar apenas os arquivos essenciais primeiro
COPY package*.json ./

#Definindo as permissões corretas
RUN chown -R node:node /usr/src/app

# Instalar Angular CLI globalmente como root, antes de mudar de usuário
RUN npm install -g @angular/cli

#Trocar para usuário node
USER node

# Instalar as dependências do projeto
RUN npm install

# Copiar o restante do projeto
COPY . .

# Instalar o Angular CLI globalmente
#RUN npm install -g @angular/cli

# Expor a porta padrão do Angular
EXPOSE 4200

# Comando de inicialização (será substituído pelo docker-compose, mas é bom para contexto)
CMD ["npm", "start"]
