# Build da imagem base com Node.js
# FROM node:18-alpine AS base
FROM node:18-bookworm-slim

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar apenas os arquivos essenciais primeiro
COPY package*.json ./

#Define o novo usuário da pasta
RUN chown -R node:node /usr/src/app

#Altera o usuário
USER node

# Instalar as dependências do projeto AQUI DURANTE O BUILD DA IMAGEM
RUN npm install 

# Copiar o restante do projeto
COPY . .

# Instala o NestJS CLI globalmente
# RUN npm install -g @nestjs/cli

# Expor a porta padrão do Nest
EXPOSE 3000

# Comando de inicialização (definido no docker-compose.yml)
CMD ["npm", "run", "start:dev"]
