from __future__ import annotations

import asyncio
import os

from dotenv import load_dotenv, set_key
from telethon import TelegramClient
from telethon.sessions import StringSession

load_dotenv()


async def create_user_session():
    """Создание сессии для user account"""
    api_id = int(os.environ["TG_API_ID"])
    api_hash = os.environ["TG_API_HASH"]

    client = TelegramClient(StringSession(), api_id, api_hash)

    await client.start()

    # Получаем информацию об аккаунте
    me = await client.get_me()
    print(f"✅ Authenticated as: {me.first_name} {me.last_name or ''} (@{me.username})")
    print(f"📱 Phone: {me.phone}")
    print(f"🆔 User ID: {me.id}")

    if me.bot:
        print("❌ This is a BOT account. Please use a regular user account.")
        return

    # Сохраняем сессию
    session_string = StringSession.save(client.session)

    print("\n" + "=" * 50)
    print("✅ USER SESSION CREATED SUCCESSFULLY!")
    print("=" * 50)
    print("Add this to your .env file:")
    update_env_file("TG_SESSION_STRING", session_string)
    print(f"TG_SESSION_STRING={session_string}")

    # Сохраняем в файл
    with open(".telegram_session", "w") as f:
        f.write(session_string)
    print("Session also saved to .telegram_session file")


def update_env_file(key: str, value: str, env_file: str = ".env"):
    """Обновление или добавление переменной в .env файл"""
    set_key(env_file, key, value)
    print(f"✅ Updated {key}={value}")


if __name__ == "__main__":
    asyncio.run(create_user_session())
