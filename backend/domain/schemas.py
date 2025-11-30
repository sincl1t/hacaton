from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel

from backend.domain.models import Platform


class ContentItem(BaseModel):
    model_config = {
        "from_attributes": True, "arbitrary_types_allowed": True
    }

    id: int
    platform: Platform
    title: str
    url: str
    published_at: datetime
    views: int
    likes: int
    comments: int
    engagement_rate_percent: float
    sentiment: float
    tags: list[str]


class SummaryStats(BaseModel):
    model_config = {
        "from_attributes": True, "arbitrary_types_allowed": True
    }
    total_items: int
    total_views: int
    total_likes: int
    total_comments: int
    avg_engagement: float
    avg_sentiment: float


class AnalyticsFilters(BaseModel):

    start_date: datetime | None = None
    end_date: datetime | None = None
    date_range: str | None = None

    platforms: list[str] | None = None
    content_types: list[str] | None = None

    min_likes: int | None = None
    min_shares: int | None = None
    min_views: int | None = None
    min_engagement_rate: float | None = None

    tags: list[str] | None = None
    require_all_tags: bool = False

    sort_by: str = "published_at"
    sort_order: str = "desc"
    limit: int | None = None


class CompareRequest(BaseModel):
    ids: list[int]


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str
