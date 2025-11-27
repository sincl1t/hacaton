from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List

from .models import ContentItem, SummaryStats, CompareRequest, ChatRequest, ChatResponse
from .services import (
    get_all_content,
    get_summary_stats,
    get_content_by_id,
    compare_items,
    ask_llm,
)

app = FastAPI(title="Web/DA – Smart Content Registry API")

# CORS для фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # на хакатоне можно так, потом сузите
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/stats/summary", response_model=SummaryStats)
def api_summary():
    return get_summary_stats()


@app.get("/api/content", response_model=List[ContentItem])
def api_content():
    return get_all_content()


@app.get("/api/content/{item_id}", response_model=ContentItem)
def api_content_item(item_id: int):
    item = get_content_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    return item


@app.post("/api/compare", response_model=List[ContentItem])
def api_compare(req: CompareRequest):
    return compare_items(req.ids)


@app.post("/api/chat", response_model=ChatResponse)
async def api_chat(req: ChatRequest):
    return await ask_llm(req.query)
