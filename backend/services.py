from typing import List, Optional
from datetime import datetime
import os

import httpx
from dotenv import load_dotenv

from .sample_data import CONTENT_ITEMS
from .models import SummaryStats, ContentItem, ChatResponse

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")


def get_all_content() -> List[ContentItem]:
    return [ContentItem(**item) for item in CONTENT_ITEMS]


def get_content_by_id(item_id: int) -> Optional[ContentItem]:
    for item in CONTENT_ITEMS:
        if item["id"] == item_id:
            return ContentItem(**item)
    return None


def get_summary_stats() -> SummaryStats:
    items = CONTENT_ITEMS
    total_items = len(items)
    total_views = sum(i["views"] for i in items)
    total_likes = sum(i["likes"] for i in items)
    total_comments = sum(i["comments"] for i in items)
    avg_engagement = (
        sum(i["engagement_rate"] for i in items) / total_items if total_items else 0
    )
    avg_sentiment = (
        sum(i["sentiment"] for i in items) / total_items if total_items else 0
    )
    return SummaryStats(
        total_items=total_items,
        total_views=total_views,
        total_likes=total_likes,
        total_comments=total_comments,
        avg_engagement=avg_engagement,
        avg_sentiment=avg_sentiment,
    )


def compare_items(ids: List[int]) -> List[ContentItem]:
    return [item for item in get_all_content() if item.id in ids]


async def ask_llm(query: str) -> ChatResponse:
    
    system_prompt = (
        "Ты — помощник по аналитике контента для Web/DA. "
        "Отвечай по-русски, структурировано и кратко. "
        "Если вопрос про метрики, объясни простыми словами, "
        "как это связано с KPI контент-менеджера."
    )

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
       
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(f"{OLLAMA_HOST}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()

        
        message = data.get("message", {})
        content = message.get("content") or ""
        if not content:
            content = "Модель Ollama ответила пустым сообщением. Попробуйте переформулировать запрос."

        answer = content

    except Exception as e:
      
        answer = (
            "Не удалось получить ответ от локальной модели Ollama.\n\n"
            f"Техническая ошибка: {e}\n\n"
            "Проверьте, что Ollama запущен и модель скачана "
            "(например, командой `ollama run llama3`)."
        )

    return ChatResponse(answer=answer)
