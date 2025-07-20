# Build da imagem base com Node.js
# FROM node:18-alpine AS base
FROM node:18-bookworm-slim

# Definir argumentos para UID/GID
ARG HOST_UID
ARG HOST_GID

# --- LINHA PARA INSTALAR O COMANDO 'ps' e evitar a queda do container em dev ---
RUN apt-get update && apt-get install -y procps --no-install-recommends && rm -rf /var/lib/apt/lists/*
# O 'rm -rf /var/lib/apt/lists/*' é para limpar o cache do apt e manter a imagem pequena.
# --- FIM DA ADIÇÃO ---

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# RUN chmod -R 777 /usr/src/app

# Copiar apenas os arquivos essenciais primeiro
COPY package*.json ./

#Define o novo usuário da pasta
# RUN chown -R node:node /usr/src/app

# --- SEÇÃO DE CONFIGURAÇÃO DE USUÁRIO PARA PERMISSÕES (DEVE ESTAR ATIVA E SEM COMENTÁRIOS) ---
# Garante que o usuário `node` no container tenha o mesmo UID/GID do seu usuário local.
# Isso é crucial para evitar problemas de permissão com volumes montados.
RUN if ! getent group "$HOST_GID" >/dev/null; then \
    addgroup --gid "$HOST_GID" node_group; \
  elif ! getent group node | grep -q ":$HOST_GID:"; then \
    groupmod -g "$HOST_GID" node; \
  fi && \
  # Em seguida, crie o usuário 'node' com o UID do host e adicione-o ao grupo correto.
  # Se o usuário 'node' já existir, ajuste seu UID e GID.
  if ! id -u node >/dev/null 2>&1; then \
    adduser --uid "$HOST_UID" --gid "$HOST_GID" --disabled-password --gecos "" node; \
  elif ! id -u node | grep -q "$HOST_UID"; then \
    usermod -u "$HOST_UID" -g "$HOST_GID" node; \
  fi && \
  chown -R node:node /usr/src/app
#--- FIM DA SEÇÃO DE CONFIGURAÇÃO DE USUÁRIO ---

# Instalar as dependências do projeto AQUI DURANTE O BUILD DA IMAGEM
#RUN npm install 

#Altera o usuário
USER node

# Copiar o restante do projeto
COPY . .

# Instala o NestJS CLI globalmente
# RUN npm install -g @nestjs/cli

# Expor a porta padrão do Nest
EXPOSE 3000

# Comando de inicialização (definido no docker-compose.yml)
CMD ["npm", "run", "start:dev"]
