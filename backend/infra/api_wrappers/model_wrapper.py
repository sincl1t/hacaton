from __future__ import annotations

from typing import TYPE_CHECKING

from aiohttp import hdrs
from pydantic import BaseModel

from backend.domain.schemas import ChatResponse
from backend.infra.api_wrappers.base import BaseWrapper

if TYPE_CHECKING:

    from aiohttp import ClientSession
    from pydantic import HttpUrl


class ModelRequestDto(BaseModel):
    model_config = {"arbitrary_types_allowed": True, "from_attributes": True}

    choices: list[ModelMessageDto]


class ModelMessageDto(BaseModel):
    model_config = {"arbitrary_types_allowed": True, "from_attributes": True}

    message: ModelAnswerDto


class ModelAnswerDto(BaseModel):
    model_config = {"arbitrary_types_allowed": True, "from_attributes": True}

    content: str


class ModelWrapper(BaseWrapper):
    def __init__(self, api_base: HttpUrl, http_session: ClientSession) -> None:
        super().__init__(
            api_base=api_base,  # type: ignore[arg-type]
            http_session=http_session,  # type: ignore[arg-type]
        )

    async def model_answer_request(self, prompt: str, model_type: str) -> ChatResponse:
        data = await self._req(
            hdrs.METH_POST,
            "/chat/completions",
            json={
                "model": model_type,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            },
            model=ModelRequestDto
        )
        return ChatResponse(answer=data.choices[0].message.content)
