# Web/DA — Умный реестр контента в MWS Tables
Проект, созданный в рамках хакатона.  
Web/DA — это веб-приложение для анализа эффективности контента с использованием данных из MWS Tables и возможностей LLM.
Приложение позволяет:
- просматривать сводную статистику контента,
- анализировать метрики публикаций,
- сравнивать посты между собой,
- получать текстовые инсайты через LLM,
- изучать детали каждой публикации,
---
##Структура Проекта
Проект разделён на два основных модуля — backend и frontend, каждый со своей логикой, зависимостями и Docker-конфигурацией. Запуск осуществляется единым docker compose up --build.

Бэкенд построен по многослойной архитектуре (Domain → Application → Infra → API) и содержит модуль аналитического агента.

backend/
│
├── agent/                    ← Агент: ML/логика анализа контента
│   ├── core/                 ← Основные цепочки, модели, утилиты
│   └── prompts/              ← Наборы промптов для LLM
│
├── api/                      ← FastAPI-маршруты и схемы
│   ├── router.py
│   └── schemas.py
│
├── application/              ← Прикладной слой, агрегаторы, сервисы
│   ├── comments_aggregator.py
│   ├── content_getter.py
│   └── mocks.py
│
├── domain/                   ← Бизнес-модели и исключения
│   ├── models.py
│   ├── schemas.py
│   └── exceptions.py
│
├── infra/                    ← Инфраструктурные адаптеры
│   ├── api_wrappers/         ← API внешних сервисов
│   ├── config.py
│   └── di.py                 ← Dependency injection
│
├── user_uploads/             ← Папка для загружаемых пользователем данных
│
├── main.py                   ← Точка входа (FastAPI)
├── login.py                  ← Логика простой аутентификации
├── models.py                 ← Старые или вспомогательные модели
│
├── .env / .env.example       ← Конфигурация окружения
├── requirements.txt          ← Python-зависимости
├── Dockerfile                ← Докер-сборка backend
└── services.py               ← Локальные сервисы

Фронтенд — это Vite + React, с кастомным UI, аналитическими панелями и чатом.

frontend/
│
├── src/
│   ├── components/           ← UI-компоненты и панели
│   ├── pages/                ← Страницы приложения (Dashboard, ChatBot и др.)
│   ├── api.js                ← Работа с backend API
│   ├── main.jsx              ← Вход в приложение
│   ├── styles.css            ← Глобальные стили
│   └── vite.config.js        ← Конфигурация сборки
│
├── dist/                     ← Скомпилированный фронт (Vite build)
│
├── node_modules/             ← npm-зависимости
├── .env.development          ← Переменные окружения
├── Dockerfile                ← Докер-сборка frontend
└── index.html                ← Точка входа для веб-приложения

Docker и Compose
docker/
│   ├── Dockerfile            ← Общий докер-файл (если используется)
│   └── start.sh              ← Скрипт запуска
│
compose.yaml                  ← Главный Docker Compose (backend + frontend)

Корень проекта

package.json                 ← зависимости, если в корне тоже используется Node
pyproject.toml               ← конфигурация Python-проектов (ruff, форматирование)
ruff.toml                    ← линтер
uv.lock                      ← lock-файл uv
swagger.mjs                  ← Swagger генератор
session_name.session         ← служебные файлы сессии
---
##Команда проекта UwU
- @splend1ddd — Frontend - Ведёт внешний облик проекта и его логику на стороне клиента.
- @darlinglis0  — Designer - Ответственна за визуальный стиль, UX-паттерны и гармонию. 
- @seele_supremacy  — Data Analyst - Работает с аналитикой, метриками, выводами и здравым смыслом. 
- @lolkries — Product - Следит за логикой продукта, сценарием использования, пользовательскими потоками. Задает направление и помогает проекту расти в нужную сторону.
- @valua_s  — Backend -  Создаёт архитектуру, API, бизнес-логику, агентный модуль, orchestrates сервисы и следит, чтобы всё работало надёжно.
---
Технологии
### Frontend
- React (Vite)
- Axios
- CSS 
- SVG-иконки

### Backend
- Python
- FastAPI
- Pydantic
---
## Как запустить проект
Проект запускается полностью через Docker, без необходимости вручную поднимать backend и frontend.
### Запуск
```bash
docker compose up --build

## После сборки и запуска сервисов приложение будет доступно по адресу:

http://localhost/
