FROM python:3.11-slim

# Рабочая директория проекта
WORKDIR /app

# Устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем код бекенда как пакет "backend"
COPY . /app/backend

# Открываем порт
EXPOSE 8000

# Запускаем приложение как backend.main (чтобы заработали from .models и др.)
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
