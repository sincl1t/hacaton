from __future__ import annotations

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.api.router import router

app = FastAPI(
    title="Web/DA – Smart Content Registry API",
)

app.include_router(router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def main():
    await TelegramStatsCollector().start()


if __name__ == "__main__":

    uvicorn.run(
        "backend.__main__:app",
        host="0.0.0.0",
        port=8000,
        workers=1
    )
