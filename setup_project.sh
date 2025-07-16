#!/bin/bash
set -e # Sai do script se qualquer comando falhar

echo "--- Verificando e criando projetos (Backend e Frontend) ---"

# --- Backend ---
PROJECT_DIR_BACKEND="backend-nest"
if [ -d "$PROJECT_DIR_BACKEND" ]; then
    echo "Diretório $PROJECT_DIR_BACKEND já existe. Verificando conteúdo..."
    # Verifica se package.json existe, se não, pode indicar um problema
    if [ ! -f "$PROJECT_DIR_BACKEND/package.json" ]; then
        echo "AVISO: $PROJECT_DIR_BACKEND existe, mas package.json não foi encontrado. Tentando recriar o projeto..."
        # Mover .devcontainer temporariamente para evitar exclusão
        if [ -d "$PROJECT_DIR_BACKEND/.devcontainer" ]; then
            mv "$PROJECT_DIR_BACKEND/.devcontainer" "./.devcontainer_backend_temp"
            echo "Movido $PROJECT_DIR_BACKEND/.devcontainer para ./.devcontainer_backend_temp"
        fi
        # Limpar o diretório existente (exceto .devcontainer se movido)
        rm -rf "$PROJECT_DIR_BACKEND"/* "$PROJECT_DIR_BACKEND"/.[!.]* 2>/dev/null || true
        # Recriar projeto
        nest new "$PROJECT_DIR_BACKEND" --skip-install
        # Mover .devcontainer de volta
        if [ -d "./.devcontainer_backend_temp" ]; then
            mv "./.devcontainer_backend_temp" "$PROJECT_DIR_BACKEND/.devcontainer"
            echo "Movido ./.devcontainer_backend_temp de volta para $PROJECT_DIR_BACKEND/.devcontainer"
        fi
        echo "Projeto NestJS recriado em $PROJECT_DIR_BACKEND."
    else
        echo "Projeto NestJS existente em $PROJECT_DIR_BACKEND."
    fi
else
    echo "Criando novo projeto NestJS em $PROJECT_DIR_BACKEND..."
    nest new "$PROJECT_DIR_BACKEND" --skip-install
    echo "Projeto NestJS criado com sucesso."
fi

# --- Frontend ---
PROJECT_DIR_FRONTEND="frontend-angular"
if [ -d "$PROJECT_DIR_FRONTEND" ]; then
    echo "Diretório $PROJECT_DIR_FRONTEND já existe. Verificando conteúdo..."
    # Verifica se package.json existe, se não, pode indicar um problema
    if [ ! -f "$PROJECT_DIR_FRONTEND/package.json" ]; then
        echo "AVISO: $PROJECT_DIR_FRONTEND existe, mas package.json não foi encontrado. Tentando recriar o projeto..."
        # Mover .devcontainer temporariamente para evitar exclusão
        if [ -d "$PROJECT_DIR_FRONTEND/.devcontainer" ]; then
            mv "$PROJECT_DIR_FRONTEND/.devcontainer" "./.devcontainer_frontend_temp"
            echo "Movido $PROJECT_DIR_FRONTEND/.devcontainer para ./.devcontainer_frontend_temp"
        fi
        # Limpar o diretório existente (exceto .devcontainer se movido)
        rm -rf "$PROJECT_DIR_FRONTEND"/* "$PROJECT_DIR_FRONTEND"/.[!.]* 2>/dev/null || true
        # Recriar projeto
        ng new "$PROJECT_DIR_FRONTEND" --skip-install --defaults --routing=false
        # Mover .devcontainer de volta
        if [ -d "./.devcontainer_frontend_temp" ]; then
            mv "./.devcontainer_frontend_temp" "$PROJECT_DIR_FRONTEND/.devcontainer"
            echo "Movido ./.devcontainer_frontend_temp de volta para $PROJECT_DIR_FRONTEND/.devcontainer"
        fi
        echo "Projeto Angular recriado em $PROJECT_DIR_FRONTEND."
    else
        echo "Projeto Angular existente em $PROJECT_DIR_FRONTEND."
    fi
else
    echo "Criando novo projeto Angular em $PROJECT_DIR_FRONTEND..."
    ng new "$PROJECT_DIR_FRONTEND" --skip-install --defaults --routing=false
    echo "Projeto Angular criado com sucesso."
fi

echo "--- Construindo e subindo os serviços Docker ---"
docker compose up --build -d

echo "--- Setup do projeto concluído! ---"
echo "Agora você pode abrir o VS Code no diretório 'nome-do-projeto' para iniciar o ambiente de desenvolvimento."