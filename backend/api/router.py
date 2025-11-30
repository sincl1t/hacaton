from __future__ import annotations

import io
import json

from fastapi import APIRouter, HTTPException, Response

from backend.agent.core.comments_chain import analyze_comments
from backend.agent.core.content_analysis import analyze_content
from backend.agent.core.content_forecast import analyze_forcast
from backend.agent.core.model_answer import LLMService
from backend.api.schemas import (
    AnalyticsActualityResponse,
    AnalyticsPreviousResponse,
    CommentAnalytics,
    ContentForecast,
    TelegramStatistics,
)
from backend.application.content_getter import ContentGetter
from backend.domain.schemas import ContentItem, SummaryStats
from backend.infra.api_wrappers.tg_wrapper import TelegramStatsCollector
from backend.infra.api_wrappers.youtube_wrapper import YouTubeWrapper
from backend.infra.config import config

router = APIRouter(
    prefix="/api", tags=[]
)
youtube = YouTubeWrapper()


service = ContentGetter()
llm_service = LLMService("alibaba/tongyi-deepresearch-30b-a3b:free")


@router.get("/stats/summary", response_model=SummaryStats)
async def api_summary():
    return await service.get_summary_stats()


@router.get("/content", response_model=list[ContentItem])
async def api_content():
    return await service.get_all_content()


@router.get("/content/{item_id}", response_model=ContentItem)
async def api_content_item(item_id: int):
    return await service.get_content_by_id(item_id)


# @router.post("/chat", response_model=ChatResponse)
# async def api_chat(req: ChatRequest):
#     return await llm_service.get_answer(req.query)


@router.post("/analytics_comments")
async def api_analytics_comments():

    comments = await youtube.get_all_comments_for_all_video()
    analysis = await analyze_comments(comments)
    try:
        return CommentAnalytics.model_validate(json.loads(analysis))
    except Exception:
        return analysis


@router.get("/channel-stats/{channel_username:str}")
async def tg_channel_stats(channel_username: str):
    try:
        client = TelegramStatsCollector()
        async with client:
            if not client.client.is_connected():
                await client.client.connect()
            if channel_username == " ":
                channel_username = config.tg_channel_username
            if client.collected_data:
                return client.collected_data
            await client.collect_channel_stats(channel_username, limit=100)
            return client.collected_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/channel-stats-download/{channel_username:str}", response_model=TelegramStatistics)
async def api_statistic(channel_username: str):
    try:
        client = TelegramStatsCollector()
        async with client:
            if not client.client.is_connected():
                await client.client.connect()
            if channel_username == " ":
                channel_username = config.tg_channel_username
            if client.collected_data:
                return client.collected_data
            await client.collect_channel_stats(channel_username, limit=100)
            csv_string = client.export_to_csv_string()
            summary = client.get_stats_summary()
            csv_file = io.BytesIO(csv_string.encode("utf-8"))
            filename = f"telegram_stats_{channel_username}.csv"
            print(summary.keys())
            return Response(
                content=csv_file.getvalue(),
                media_type="text/csv",
                headers={
                    "Content-Disposition": f"attachment; filename={filename}",
                    "X-Stats-Summary": json.dumps(summary, default=str),
                    "X-Total-Posts": str(summary["total_posts"]),
                    "X-Total-Comments": str(summary["total_comments"]),
                }
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content-ai-recomendations/tg/{post_id:int}", response_model=AnalyticsPreviousResponse)
async def content_with_ai_recomendations_tg(post_id: int):
    try:
        client = TelegramStatsCollector()
        async with client:
            if not client.client.is_connected():
                await client.client.connect()
            if not client.collected_data:
                await client.collect_channel_stats(config.tg_channel_username, limit=100)
            post = client.collected_data[post_id]
            return await analyze_content(post)
    except IndexError:
        raise HTTPException(status_code=404, detail={"message": "Post not found"})
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/content-ai-recomendations/youtube/{post_id:int}", response_model=AnalyticsPreviousResponse)
async def content_with_ai_recomendations_yt(post_id: int):
    post = await service.get_one_yt_mock(post_id)
    if post:
        try:
            return AnalyticsPreviousResponse.model_validate(json.loads(await analyze_content(post.model_dump())))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=404, detail={"message": "Post not found"})


@router.get("/content-ai-recomendations/vk/{post_id:int}", response_model=AnalyticsPreviousResponse)
async def content_with_ai_recomendations_vk(post_id: int):
    post = await service.get_one_vk_mock(post_id)
    if post:
        try:
            return AnalyticsPreviousResponse.model_validate(json.loads(await analyze_content(post.model_dump())))
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        raise HTTPException(status_code=404, detail={"message": "Post not found"})


@router.post("/content-ai-recomendations/forecast", response_model=AnalyticsActualityResponse)
async def content_forecast(query: ContentForecast):
    try:
        return await analyze_forcast(**query)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
