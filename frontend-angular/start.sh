#!/bin/bash

# Este script garante que as variáveis de ambiente do npm/npx sejam carregadas
# e executa os comandos em sequência.

echo "--- Executando npm install ---"
npm install

echo "--- Executando npx tailwindcss init -p ---"
# O npx tailwindcss init -p só deve ser executado uma vez.
# Verifica se o arquivo tailwind.config.js já existe antes de tentar criá-lo.
if [ ! -f tailwind.config.js ]; then
  npx tailwindcss init -p
else
  echo "tailwind.config.js já existe, pulando npx tailwindcss init -p"
fi

echo "--- Iniciando servidor Angular ---"
npm start
