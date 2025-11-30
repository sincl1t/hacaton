from __future__ import annotations

import ast
import enum
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, Float, Integer, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class ContentType(enum.StrEnum):
    ARTICLE = "article"
    VIDEO = "video"
    POST = "post"


class Platform(enum.StrEnum):
    VK = "vk"
    TELEGRAM = "telegram"
    YOUTUBE = "youtube"


class Base(DeclarativeBase):
    id: Mapped[int] = mapped_column(
        BigInteger, primary_key=True, autoincrement=True
    )


class Content(Base):
    __tablename__ = "content"

    title: Mapped[str] = mapped_column(String, unique=True)
    url: Mapped[str] = mapped_column(String)
    content_type: Mapped[ContentType] = mapped_column(Enum(ContentType))
    platform: Mapped[Platform] = mapped_column(Enum(Platform))
    published_at: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    likes: Mapped[int] = mapped_column(Integer, default=0)
    shares: Mapped[int] = mapped_column(Integer, default=0)
    comments: Mapped[int] = mapped_column(Integer, default=0)
    saves: Mapped[int] = mapped_column(Integer, default=0)
    views: Mapped[int] = mapped_column(Integer, default=0)
    unique_views: Mapped[int] = mapped_column(Integer, default=0)
    avg_watch_time_sec: Mapped[float] = mapped_column(Float, default=0.0)
    completion_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    sentiment: Mapped[float] = mapped_column(Float, default=0.0)
    click_through_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    engagement_rate_percent: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    tags_str: Mapped[str] = mapped_column(String, nullable=True)

    @property
    def tags(self) -> list[str]:
        if self.tags_str:
            return ast.literal_eval(self.tags_str)
        return []
