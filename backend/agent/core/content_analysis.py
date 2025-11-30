from __future__ import annotations

from typing import Any

from backend.agent.core.openapi_router import get_openai_client
from backend.agent.core.utils import MODEL_CONFIG
from backend.agent.prompts.analyser_previous import ANALYSIS_PROMPT


async def analyze_content(content_data: dict[str, Any]) -> str:
    client = get_openai_client()
    if isinstance(content_data["tags"], dict):
        content_data["tags"] = ",".join([tag for tag in content_data["tags"]])
    messages = ANALYSIS_PROMPT.format_messages(**content_data)
    openai_messages = []
    for msg in messages:
        # Преобразуем роли из LangChain в OpenAI
        if msg.type == "human":
            role = "user"
        elif msg.type == "ai":
            role = "assistant"
        elif msg.type == "system":
            role = "system"
        else:
            role = "user"  # fallback

        openai_messages.append({
            "role": role,
            "content": msg.content
        })
    response = client.chat.completions.create(
        model=MODEL_CONFIG["analysis_model"].get("model"),
        messages=openai_messages,
        temperature=MODEL_CONFIG["analysis_model"].get("temperature")
    )
    return response.choices[0].message.content
