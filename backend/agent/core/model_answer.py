from __future__ import annotations

from backend.domain.schemas import ChatResponse
from backend.infra.di import create_model_wrapper


class LLMService:
    def __init__(self, model: str) -> None:
        self.model_wrapper = create_model_wrapper()
        self.model = model

    async def get_answer(self, question: str) -> ChatResponse:
        async with self.model_wrapper as model:
            return (await model.model_answer_request(
                question, self.model
            ))
