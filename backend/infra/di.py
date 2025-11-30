from __future__ import annotations

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

import aiohttp
from aiohttp import ClientSession
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker

from backend.infra.api_wrappers.model_wrapper import ModelWrapper
from backend.infra.config import config

type DbSessionFactory = async_sessionmaker[AsyncSession]


@asynccontextmanager
async def create_model_wrapper() -> AsyncIterator[ModelWrapper]:
    session = ClientSession(connector=aiohttp.TCPConnector(ssl=False))
    try:
        wrapper = ModelWrapper(
            api_base=config.model_api_url,
            http_session=session
        )
        yield wrapper
    finally:
        await session.close()
