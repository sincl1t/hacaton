from __future__ import annotations

from openai import OpenAI

from backend.infra.config import config


def get_openai_client() -> OpenAI:
    return OpenAI(
        base_url=config.model_api_url,
        api_key=config.model_api_key.get_secret_value()
    )
