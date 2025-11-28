from typing import List, Optional
from datetime import datetime
import os
import json
import hashlib

import httpx
from dotenv import load_dotenv

from sample_data import CONTENT_ITEMS
from models import (
    SummaryStats,
    ContentItem,
    ChatResponse,
    User,
    UserProfile,
)

load_dotenv()

OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# ---------- НАСТРОЙКИ ДЛЯ ПОЛЬЗОВАТЕЛЕЙ ----------

BASE_DIR = os.path.dirname(__file__)
USERS_FILE = os.path.join(BASE_DIR, "users.json")
MEDIA_DIR = os.path.join(BASE_DIR, "user_uploads")

AUTH_SALT = os.getenv("AUTH_SALT", "change_me_salt_for_demo")

os.makedirs(MEDIA_DIR, exist_ok=True)


def _load_users() -> List[dict]:
    if not os.path.exists(USERS_FILE):
        return []
    try:
        with open(USERS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return []


def _save_users(users: List[dict]) -> None:
    with open(USERS_FILE, "w", encoding="utf-8") as f:
        json.dump(users, f, ensure_ascii=False, indent=2)


def hash_password(password: str) -> str:
    data = (AUTH_SALT + password).encode("utf-8")
    return hashlib.sha256(data).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


def get_user_by_email(email: str) -> Optional[User]:
    users = _load_users()
    for u in users:
        if u["email"].lower() == email.lower():
            return User(**u)
    return None


def create_user(email: str, password: str) -> User:
    users = _load_users()
    if any(u["email"].lower() == email.lower() for u in users):
        raise ValueError("Пользователь с таким email уже существует")

    new_id = max((u["id"] for u in users), default=0) + 1
    username = email.split("@")[0]

    user_dict = {
        "id": new_id,
        "email": email,
        "password_hash": hash_password(password),
        "created_at": datetime.utcnow().isoformat(),

        "username": username,
        "role": "user",
        "bio": "",
        "avatar_url": None,
    }
    users.append(user_dict)
    _save_users(users)
    return User(**user_dict)


def authenticate_user(email: str, password: str) -> Optional[User]:
    users = _load_users()
    for u in users:
        if u["email"].lower() == email.lower():
            if verify_password(password, u["password_hash"]):
                return User(**u)
            break
    return None


def get_user_profile(email: str) -> Optional[UserProfile]:
    user = get_user_by_email(email)
    if not user:
        return None
    return UserProfile(
        email=user.email,
        username=user.username,
        role=user.role,
        bio=user.bio,
        avatar_url=user.avatar_url,
        created_at=user.created_at,
    )


def update_user_profile(
    email: str, username: Optional[str], role: Optional[str], bio: Optional[str]
) -> Optional[UserProfile]:
    users = _load_users()
    updated_user = None

    for u in users:
        if u["email"].lower() == email.lower():
            if username is not None:
                u["username"] = username
            if role is not None:
                u["role"] = role
            if bio is not None:
                u["bio"] = bio
            updated_user = u
            break

    if not updated_user:
        return None

    _save_users(users)
    return get_user_profile(updated_user["email"])


def save_user_avatar(email: str, filename: str) -> Optional[UserProfile]:
    users = _load_users()
    updated_user = None

    avatar_url = f"/media/{filename}"

    for u in users:
        if u["email"].lower() == email.lower():
            u["avatar_url"] = avatar_url
            updated_user = u
            break

    if not updated_user:
        return None

    _save_users(users)
    return get_user_profile(updated_user["email"])


# ---------- КОНТЕНТ / СТАТИСТИКА ----------


def get_all_content() -> List[ContentItem]:
    return [ContentItem(**item) for item in CONTENT_ITEMS]


def get_content_by_id(item_id: int) -> Optional[ContentItem]:
    for item in CONTENT_ITEMS:
        if item["id"] == item_id:
            return ContentItem(**item)
    return None


def get_summary_stats() -> SummaryStats:
    items = CONTENT_ITEMS
    total_items = len(items)
    total_views = sum(i["views"] for i in items)
    total_likes = sum(i["likes"] for i in items)
    total_comments = sum(i["comments"] for i in items)
    avg_engagement = (
        sum(i["engagement_rate"] for i in items) / total_items if total_items else 0
    )
    avg_sentiment = (
        sum(i["sentiment"] for i in items) / total_items if total_items else 0
    )
    return SummaryStats(
        total_items=total_items,
        total_views=total_views,
        total_likes=total_likes,
        total_comments=total_comments,
        avg_engagement=avg_engagement,
        avg_sentiment=avg_sentiment,
    )


def compare_items(ids: List[int]) -> List[ContentItem]:
    return [item for item in get_all_content() if item.id in ids]


async def ask_llm(query: str) -> ChatResponse:
    system_prompt = (
        "Ты — помощник по аналитике контента для Web/DA. "
        "Отвечай по-русски, структурировано и кратко. "
        "Если вопрос про метрики, объясни простыми словами, "
        "как это связано с KPI контент-менеджера."
    )

    payload = {
        "model": OLLAMA_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": query},
        ],
        "stream": False,
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            resp = await client.post(f"{OLLAMA_HOST}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()

        message = data.get("message", {})
        content = message.get("content") or ""
        if not content:
            content = (
                "Модель Ollama ответила пустым сообщением. "
                "Попробуйте переформулировать запрос."
            )

        answer = content

    except Exception as e:
        answer = (
            "Не удалось получить ответ от локальной модели Ollama.\n\n"
            f"Техническая ошибка: {e}\n\n"
            "Проверьте, что Ollama запущен и модель скачана "
            "(например, командой `ollama run llama3`)."
        )

    return ChatResponse(answer=answer)
