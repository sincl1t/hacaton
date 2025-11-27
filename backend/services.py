from typing import List, Optional
from .sample_data import CONTENT_ITEMS
from .models import SummaryStats, ContentItem, ChatResponse


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
    answer = (
        "Это заглушка ответа LLM.\n\n"
        f"Вы спросили: «{query}».\n"
        "В боевой версии здесь будет анализ статистики из MWS Tables "
        "и человекопонятное объяснение для контент-менеджера."
    )
    return ChatResponse(answer=answer)
