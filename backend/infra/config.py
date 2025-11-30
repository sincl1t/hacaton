from __future__ import annotations

from typing import Annotated

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings

type _NonBlankStr = Annotated[str, Field(min_length=1)]
type _NonBlankSecretStr = Annotated[SecretStr, Field(min_length=1)]
type _Port = Annotated[int, Field(ge=0, le=65535)]


class _Settings(BaseSettings):
    model_config = {"frozen": True, "env_file": ".env", "extra": "allow"}

    model_api_url: _NonBlankStr
    model_api_key: _NonBlankSecretStr

    youtube_api_key: _NonBlankSecretStr
    youtube_channel_id: _NonBlankStr

    vk_api_url: _NonBlankStr
    vk_api_key: _NonBlankSecretStr

    tg_api_id: _NonBlankStr
    tg_api_hash: _NonBlankStr
    tg_channel_username: _NonBlankStr
    tg_session_string: _NonBlankStr


config = _Settings()
