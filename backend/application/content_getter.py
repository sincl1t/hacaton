from __future__ import annotations

from statistics import mean

from backend.application.mocks import TG_MOCK, VK_MOCK, YOUTUBE_MOCK
from backend.domain.schemas import ContentItem, SummaryStats


class ContentGetter:

    async def get_all_content(self) -> list[ContentItem]:
        all_content = VK_MOCK + TG_MOCK + YOUTUBE_MOCK
        return [ContentItem.model_validate(content) for content in all_content]

    async def get_vk_mock(self) -> list[ContentItem]:
        return [ContentItem.model_validate(content) for content in VK_MOCK]

    async def get_one_vk_mock(self, post_id: int) -> ContentItem | None:
        for content in VK_MOCK:
            if content["id"] == post_id:
                return ContentItem.model_validate(content)

    async def get_one_yt_mock(self, post_id: int) -> ContentItem | None:
        for content in YOUTUBE_MOCK:
            if content["id"] == post_id:
                return ContentItem.model_validate(content)

    async def get_youtube_mock(self) -> list[ContentItem]:
        return [ContentItem.model_validate(content) for content in YOUTUBE_MOCK]

    async def get_summary_stats(self) -> SummaryStats:
        content_items = VK_MOCK + TG_MOCK + YOUTUBE_MOCK
        total_items = len(content_items)
        total_views = sum(item["views"] for item in content_items)
        total_likes = sum(item["likes"] for item in content_items)
        total_comments = sum(item["comments"] for item in content_items)
        avg_engagement = mean(item["engagement_rate_percent"] for item in content_items)
        avg_sentiment = mean(item["sentiment"] for item in content_items)

        return SummaryStats(
            total_items=total_items,
            total_views=total_views,
            total_likes=total_likes,
            total_comments=total_comments,
            avg_engagement=avg_engagement,
            avg_sentiment=avg_sentiment
        )

    async def get_content_by_id(self, content_id: int) -> ContentItem | None:
        all_content = VK_MOCK + TG_MOCK + YOUTUBE_MOCK
        for content in all_content:
            if content["id"] == content_id:
                return ContentItem.model_validate(content)
