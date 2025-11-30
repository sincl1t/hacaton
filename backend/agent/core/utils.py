from __future__ import annotations

import json
import logging
import re
from typing import Any

logger = logging.getLogger(__name__)

DATABASE_KEYWORDS = [
    "статистик", "аналитик", "данные", "метрики", "показатели",
    "эффективность", "вовлеченность", "просмотры", "лайки",
    "репосты", "контент", "публикации", "отчет", "тренды",
    "топ", "лучший", "популярный", "рейтинг"
]

MODEL_CONFIG: dict[str, Any] = {
    "filter_model": {
        "model": "x-ai/grok-4.1-fast:free",
        "temperature": 0.1,
    },
    "planning_model": {
        "model": "x-ai/grok-4.1-fast:free",
        "temperature": 0.2,
    },
    "analysis_model": {
        "model": "x-ai/grok-4.1-fast:free",
        "temperature": 0.2,
    },
    "validation_model": {
        "model": "x-ai/grok-4.1-fast:free",
        "temperature": 0.1,
    },
    "formatting_model": {
        "model": "x-ai/grok-4.1-fast:free",
        "temperature": 0.3,
    }
}

DATA_LIMITS = {
    "max_database_records": 10,
    "max_response_length": 2000,
    "max_reflection_depth": 3
}


class RobustJsonParser:
    """Надежный парсер JSON с обработкой различных форматов ответов"""

    def __init__(self):
        self.json_parser = json.loads

    @staticmethod
    def safe_json_parse(text: str, default: Any = None) -> dict[str, Any] | None:
        """Безопасно парсит JSON из текста, извлекая его даже если есть дополнительные символы
        """
        if not text:
            return default

        # Пытаемся найти JSON в тексте с помощью regex
        json_pattern = r"\{[^{}]*\{[^{}]*\}[^{}]*\}|\[[^\[\]]*\[[^\[\]]*\][^\[\]]*\]|\{[^{}]*\}"
        matches = re.findall(json_pattern, text, re.DOTALL)

        for match in matches:
            try:
                # Чистим match от возможных markdown оберток
                clean_match = re.sub(r"```json\s*|\s*```", "", match.strip())
                parsed = json.loads(clean_match)
                logger.debug("Успешно распарсен JSON из текста")
                return parsed
            except json.JSONDecodeError:
                continue

        # Если не нашли JSON паттерн, пробуем парсить весь текст
        try:
            clean_text = re.sub(r"```json\s*|\s*```", "", text.strip())
            parsed = json.loads(clean_text)
            logger.debug("Успешно распарсен весь текст как JSON")
            return parsed
        except json.JSONDecodeError as e:
            logger.warning(f"Не удалось распарсить JSON: {e}\nТекст: {text[:200]}...")
            return default

    def extract_json_from_response(self, response_text: str) -> dict[str, Any] | None:
        """Извлекает JSON из ответа модели, даже если есть дополнительные текстовые элементы
        """
        if not response_text:
            return None

        # Удаляем общие префиксы/суффиксы
        clean_text = response_text.strip()

        # Пытаемся найти JSON объект или массив
        json_match = re.search(r"(\{.*\}|\[.*\])", clean_text, re.DOTALL)

        if json_match:
            json_str = json_match.group(1)
            try:
                return json.loads(json_str)
            except json.JSONDecodeError:
                logger.warning(f"Найден JSON-like текст, но невалидный: {json_str[:100]}...")

        # Если не нашли, пробуем безопасный парсинг
        return self.safe_json_parse(clean_text)

    def parse(self, text: str) -> dict[str, Any] | None:
        """Парсит текст, пытаясь извлечь JSON"""
        if not text:
            return None

        # Сначала пробуем прямой парсинг
        try:
            return self.json_parser(text.strip())
        except json.JSONDecodeError:
            pass

        # Затем пробуем извлечь JSON из текста
        extracted = self.extract_json_from_response(text)
        if extracted:
            return extracted

        # Если все провалилось, логируем и возвращаем None
        logger.error(f"Не удалось извлечь JSON из ответа: {text[:200]}...")
        return None
