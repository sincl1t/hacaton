from pydantic import BaseModel
from typing import List, Optional


class ContentItem(BaseModel):
    id: int
    platform: str
    title: str
    url: str
    author: str
    published_at: str
    views: int
    likes: int
    comments: int
    engagement_rate: float
    sentiment: float
    tags: List[str]
    status: str


class SummaryStats(BaseModel):
    total_items: int
    total_views: int
    total_likes: int
    total_comments: int
    avg_engagement: float
    avg_sentiment: float


class CompareRequest(BaseModel):
    ids: List[int]


class ChatRequest(BaseModel):
    query: str


class ChatResponse(BaseModel):
    answer: str
