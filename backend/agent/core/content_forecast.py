from __future__ import annotations

from backend.agent.core.openapi_router import get_openai_client
from backend.agent.core.utils import MODEL_CONFIG
from backend.agent.prompts.analyse_actuality import ANALYSIS_PROMPT


async def analyze_forcast(user_query: str, content_info: str) -> str:
    client = get_openai_client()
    messages = ANALYSIS_PROMPT.format_messages(
        user_query=user_query, post_text=content_info
    )
    openai_messages = []
    for msg in messages:
        if msg.type == "human":
            role = "user"
        elif msg.type == "ai":
            role = "assistant"
        elif msg.type == "system":
            role = "system"
        else:
            role = "user"

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
