from __future__ import annotations

from backend.agent.core.openapi_router import get_openai_client
from backend.agent.core.utils import MODEL_CONFIG
from backend.agent.prompts.analyse_comment import ANALYSIS_COMMENTS_PROMPT


async def analyze_comments(comments: list[str]) -> str:
    client = get_openai_client()
    comments_text = "\n".join([f"• {comment}" for comment in comments])
    messages = ANALYSIS_COMMENTS_PROMPT.format_messages(comments=comments_text)
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
