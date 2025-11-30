from __future__ import annotations

from langchain_core.prompts import ChatPromptTemplate

ANALYSIS_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        "Ты — главный аналитик контентной стратегии. Твоя задача — глубоко анализировать "
        "данные и предоставлять actionable инсайты. Используй данные из базы, статистику "
        "и контекст запроса для формирования комплексного анализа. Будь конкретным, "
        "используй цифры и предоставляй практические рекомендации."
    ),
    (
        "human",
        "Данные cо статистикой:\n"
        "- Заголовок: {title}\n"
        "- Просмотры: {views}\n"
        "- Лайки: {likes}\n"
        "- Комментарии: {comments}\n"
        "- Процент вовлеченности: {engagement_rate_percent}%\n"
        "- Теги: {tags}\n"
        "Проанализируй и предоставь ответ в формате JSON:\n"
        "{{\n"
        '  "insights": "ключевые выводы и наблюдения",\n'
        '  "recommendations": ["практические рекомендации"],\n'
        '  "metrics": {{"metric_name": value}},\n'
        "}}"
    )
])
