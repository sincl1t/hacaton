#!/usr/bin/env bash
set -e

# Определяем корень проекта (учитывает пробелы в пути)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Project root: $PROJECT_ROOT"

#######################################
# (опционально) запуск Ollama-сервера
#######################################
# Если Ollama уже установлена как приложение на macOS,
# обычно ничего запускать не нужно — сервис стартует сам.
# Раскомментируй строку ниже, если хочешь поднимать вручную.
#
# ollama serve >/dev/null 2>&1 &

#######################################
# Запускаем backend (FastAPI)
#######################################
cd "$PROJECT_ROOT"
python3 -m uvicorn backend.main:app --reload &
BACKEND_PID=$!
echo "Backend started (pid: $BACKEND_PID)"

#######################################
# Запускаем frontend (Vite)
#######################################
cd "$PROJECT_ROOT/frontend"
npm run dev &
FRONTEND_PID=$!
echo "Frontend started (pid: $FRONTEND_PID)"

echo ""
echo "✨ Приложение запущено:"
echo "  Backend:  http://localhost:8000"
echo "  Frontend: http://localhost:5173"
echo ""
echo "Нажми Ctrl+C, чтобы остановить оба процесса."

# При Ctrl+C убиваем оба процесса
trap "echo 'Останавливаю...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null || true; exit 0" INT

# Ждём, пока хоть что-то из них не завершится
wait
