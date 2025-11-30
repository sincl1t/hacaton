from __future__ import annotations

from typing import Any

from pydantic import BaseModel


class CommentAnalytics(BaseModel):
    model_config = {"from_attributes": True}

    tone: str
    thems: list[str]
    key_moments: str


class ChannelName(BaseModel):
    channel_name: str | None = None


class ContentForecast(BaseModel):
    model_config = {"from_attributes": True}

    query_user: str
    content_info: str


class TelegramStatistics(BaseModel):

    file: str | None = None
    statistics: list[dict[str, Any]]


class AnalyticsPreviousResponse(BaseModel):
    model_config = {"from_attributes": True}

    insights: str
    recommendations: list[str]
    metrics: dict[str, Any]


class AnalyticsActualityResponse(BaseModel):
    model_config = {"from_attributes": True}

    insights: str
    recommendations: list[str]
    forecast: str
