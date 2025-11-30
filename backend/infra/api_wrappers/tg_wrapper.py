from __future__ import annotations

import asyncio
import csv
import re
from datetime import datetime
from io import StringIO

from telethon import TelegramClient
from telethon.sessions import StringSession
from telethon.tl.functions.messages import GetDiscussionMessageRequest
from telethon.tl.types import Message, MessageMediaDocument, MessageMediaPhoto

from backend.domain.models import ContentType, Platform
from backend.infra.config import config


class TelegramStatsCollector:
    def __init__(self) -> None:
        self.client = TelegramClient(
            StringSession(config.tg_session_string), config.tg_api_id, config.tg_api_hash
        )
        self.collected_data = []
        self.collection_timestamp: datetime | None = None

    async def __aenter__(self):
        await self.client.connect()
        return self

    async def __aexit__(self, *args):
        if self.client:
            await self.client.disconnect()

    async def collect_channel_stats(self, channel_username: str, limit: int = 1000):
        """Сбор статистики со всего канала"""
        try:
            channel = await self.client.get_entity(channel_username)
            messages = await self.client.get_messages(channel, limit=limit)
            print(channel, channel_username)
            for index, message in enumerate(messages):
                if not message.message:
                    continue

                content_data = await self.extract_message_data(index, message, channel)
                await self.save_content_stats(content_data)

        except Exception as e:
            print(f"Ошибка сбора статистики: {e}")

    async def extract_message_data(self, index: int, message: Message, channel) -> dict:
        """Извлечение данных из сообщения"""
        content_type = self.determine_content_type(message)

        base_metrics = {
            "id": index,
            "tg_id": message.id,
            "title": self.extract_title(message),
            "url": f"https://t.me/{channel.username}/{message.id}",
            "content_type": content_type,
            "platform": Platform.TELEGRAM,
            "published_at": message.date,
            "likes": (getattr(message, "reactions", None) and self.count_reactions(message.reactions)) or 0,
            "shares": message.forwards or 0 if message.forwards else 0,
            "comments": await self.get_comments_count(message, channel),
            "views": message.views or 0 if hasattr(message, "views") else 0,
            "tags_str": self.extract_tags(message.message),
        }

        advanced_metrics = await self.calculate_advanced_metrics(message, channel)

        return {**base_metrics, **advanced_metrics}

    def determine_content_type(self, message: Message) -> ContentType:
        """Определение типа контента"""
        media = message.media

        if isinstance(media, MessageMediaPhoto):
            return ContentType.POST
        if isinstance(media, MessageMediaDocument):
            doc = media.document
            if doc.mime_type.startswith("video/"):
                return ContentType.VIDEO
            if doc.mime_type.startswith("audio/"):
                return ContentType.POST
            return ContentType.POST
        # Анализ текста для определения типа
        text = message.message.lower()
        if any(word in text for word in ["опрос", "опросы", "poll"]) or any(word in text for word in ["опрос", "quiz"]):
            return ContentType.POST
        return ContentType.ARTICLE

    def extract_title(self, message: Message) -> str:
        """Извлечение заголовка из сообщения"""
        text = message.message
        if not text:
            return f"Message {message.id}"

        # Берем первую строку или первые 50 символов
        first_line = text.split("\n")[0]
        return first_line[:50] + "..." if len(first_line) > 50 else first_line

    def extract_tags(self, text: str) -> str:
        """Извлечение хештегов из текста"""
        if not text:
            return ""
        hashtags = re.findall(r"#\w+", text)
        return ",".join(hashtags)

    def count_reactions(self, reactions) -> int:
        """Подсчет общего количества реакций"""
        if not reactions:
            return 0
        return sum(getattr(reaction, "count", 0) for reaction in reactions.results)

    async def get_comments_texts(self, message: Message, channel, limit: int = 10) -> list[str]:
        """Получение списка текстов первых N комментариев"""
        try:
            discussion = await self.client.get_discussion_message(channel, message.id)

            if not discussion or not hasattr(discussion, "replies"):
                return []

            replies = discussion.replies
            comment_texts = []

            async for comment in self.client.iter_messages(
                replies.chat_id,
                limit=limit,
                reply_to=replies.reply_to_msg_id
            ):
                if comment.message and comment.message.strip():
                    comment_texts.append(comment.message.strip())

            return comment_texts

        except Exception as e:
            print(f"Ошибка получения текстов комментариев: {e}")
            return []

    async def get_comments_count(self, message: Message, channel) -> int:
        """Получение общего количества комментариев"""
        try:
            discussion = await self.get_comments_data(channel, message.id)

            if not discussion or not hasattr(discussion, "replies"):
                return 0

            replies = discussion.replies

            if hasattr(replies, "replies_count"):
                return replies.replies_count
            if hasattr(replies, "max_id"):
                return replies.max_id
            return 0

        except Exception as e:
            print(f"Ошибка получения количества комментариев: {e}")
            return 0

    async def get_comments_data(self, message: Message, channel):
        """Получение полных данных о комментариях: список текстов + количество"""
        try:
            # Параллельно получаем тексты и количество
            comment_texts_task = self.get_comments_texts(message, channel, limit=10)
            comments_count_task = self.get_comments_count(message, channel)

            comment_texts, comments_count = await asyncio.gather(
                comment_texts_task,
                comments_count_task,
                return_exceptions=True
            )

            # Обрабатываем возможные исключения
            if isinstance(comment_texts, Exception):
                print(f"Ошибка в get_comments_texts: {comment_texts}")
                comment_texts = []
            if isinstance(comments_count, Exception):
                print(f"Ошибка в get_comments_count: {comments_count}")
                comments_count = 0

            return {
                "comments_count": comments_count,
                "comment_texts": comment_texts,  # Список строк с текстами комментариев
                "has_comments": comments_count > 0,
                "texts_retrieved": len(comment_texts)
            }

        except Exception as e:
            print(f"Общая ошибка получения данных комментариев: {e}")
            return {
                "comments_count": 0,
                "comment_texts": [],
                "has_comments": False,
                "texts_retrieved": 0
            }

    async def calculate_advanced_metrics(self, message: Message, channel) -> dict:
        """Вычисление расширенных метрик(не реализуются в ТГ)"""
        engagement = await self.calculate_engagement_rate(message, channel)
        return {
            "saves": 0,
            "unique_views": message.views or 0,
            "avg_watch_time_sec": 0,
            "completion_rate_percent": 0,
            "sentiment": await self.analyze_sentiment(message),
            "click_through_rate_percent": 0,
            "engagement_rate_percent": engagement,
        }

    async def calculate_engagement_rate(self, message: Message, channel) -> float:
        try:
            views = message.views or 1
            reactions = self.count_reactions(getattr(message, "reactions", None))
            shares = message.forwards or 0
            comments = await self.get_comments_count(message, channel)

            engagement = (reactions + shares + comments) / views * 100
            return min(engagement, 100)
        except:
            return 0.0

    async def analyze_sentiment(self, message: Message) -> float:
        """Упрощенный анализ тональности (заглушка)"""
        text = message.message or ""

        positive_words = ["отлично", "прекрасно", "супер", "спасибо", "хорошо"]
        negative_words = ["плохо", "ужасно", "кошмар", "разочарован"]

        score = 0.5

        for word in positive_words:
            if word in text.lower():
                score += 0.1

        for word in negative_words:
            if word in text.lower():
                score -= 0.1

        return max(0.0, min(1.0, score))

    async def collect_channel_stats(self, channel_username: str, limit: int = 1000):
        """Сбор статистики и сохранение в памяти"""
        try:
            self.collection_timestamp = datetime.now()
            channel = await self.client.get_entity(channel_username)
            messages = await self.client.get_messages(channel, limit=limit)
            print(channel, channel_username)  # TODO
            print(f"Найдено {len(messages)} сообщений в канале {channel_username}")

            for i, message in enumerate(messages, 1):
                if not message.message:
                    continue

                print(f"Обрабатывается сообщение {i}/{len(messages)}: {message.id}")

                content_data = await self.extract_message_data(i, message, channel)
                self.collected_data.append(content_data)

            print(f"Сбор данных завершен. Сохранено {len(self.collected_data)} записей")

        except Exception as e:
            print(f"Ошибка сбора статистики: {e}")

    def get_stats_summary(self) -> dict:
        """Получение сводки по собранным данным"""
        if not self.collected_data:
            return {}

        total_posts = len(self.collected_data)
        total_comments = sum(item.get("comments_count", 0) for item in self.collected_data)
        total_views = sum(item.get("views", 0) for item in self.collected_data)
        total_likes = sum(item.get("likes", 0) for item in self.collected_data)

        return {
            "total_posts": total_posts,
            "total_comments": total_comments,
            "total_views": total_views,
            "total_likes": total_likes,
            "avg_engagement": total_likes / total_views * 100 if total_views > 0 else 0,
            "collection_time": self.collection_timestamp.isoformat() if self.collection_timestamp else None,
            "posts_with_comments": sum(1 for item in self.collected_data if item.get("comments_count", 0) > 0)
        }

    def export_to_csv_string(self) -> str:
        """Экспорт данных в CSV строку"""
        if not self.collected_data:
            return ""

        # Создаем строковый буфер для CSV
        output = StringIO()
        writer = csv.writer(output)

        # Заголовки CSV
        headers = [
            "Title", "URL", "Content Type", "Platform", "Published At",
            "Likes", "Shares", "Comments Count", "Views", "Tags",
            "Comments Retrieved", "Comment Texts"
        ]
        writer.writerow(headers)

        # Данные
        for item in self.collected_data:
            # Обрабатываем тексты комментариев
            published_at = item.get("published_at")
            if isinstance(published_at, datetime):
                published_at = published_at.strftime("%Y-%m-%d %H:%M:%S")
            comment_texts = item.get("comment_texts", [])
            comments_str = " | ".join([f'"{text}"' for text in comment_texts])

            row = [
                item.get("title", ""),
                item.get("url", ""),
                item.get("content_type", ""),
                item.get("platform", ""),
                published_at,
                item.get("likes", 0),
                item.get("shares", 0),
                item.get("comments_count", 0),
                item.get("views", 0),
                item.get("tags_str", ""),
                item.get("texts_retrieved", 0),
                comments_str
            ]
            writer.writerow(row)

        csv_string = output.getvalue()
        output.close()

        return csv_string

    def export_to_csv_file(self, filename: str = None):
        """Экспорт данных в CSV файл"""
        if not self.collected_data:
            print("Нет данных для экспорта")
            return None

        if not filename:
            timestamp = self.collection_timestamp.strftime("%Y%m%d_%H%M%S") if self.collection_timestamp else datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"telegram_stats_{timestamp}.csv"

        csv_string = self.export_to_csv_string()

        with open(filename, "w", encoding="utf-8") as f:
            f.write(csv_string)

        print(f"Данные экспортированы в {filename}")
        return filename

    def get_raw_data(self) -> list[dict]:
        """Получение сырых данных"""
        return self.collected_data

    def clear_data(self):
        """Очистка собранных данных"""
        self.collected_data.clear()
        self.collection_timestamp = None
        print("Данные очищены")

    def get_comments_analysis(self) -> dict:
        """Анализ комментариев"""
        if not self.collected_data:
            return {}

        all_comments = []
        posts_with_comments = 0

        for item in self.collected_data:
            comments = item.get("comment_texts", [])
            if comments:
                all_comments.extend(comments)
                posts_with_comments += 1

        return {
            "total_comments_texts": len(all_comments),
            "posts_with_comments": posts_with_comments,
            "avg_comments_per_post": len(all_comments) / posts_with_comments if posts_with_comments > 0 else 0,
            "sample_comments": all_comments[:10]
        }

    async def get_comments_texts(self, message: Message, channel, limit: int = 10) -> list[str]:
        """Получение списка текстов первых N комментариев"""
        try:
            # Для большинства каналов комментарии недоступны через API
            # Возвращаем пустой список
            return []

        except Exception as e:
            print(f"Ошибка получения текстов комментариев: {e}")
            return []

    async def get_comments_count(self, message: Message, channel) -> int:
        """Получение общего количества комментариев"""
        try:
            # Для большинства каналов комментарии недоступны через API
            # Возвращаем 0
            return 0

        except Exception as e:
            print(f"Ошибка получения количества комментариев: {e}")
            return 0

    async def get_comments_data(self, message: Message, channel):
        """Получение полных данных о комментариях: список текстов + количество"""
        try:
            # Упрощенная реализация - комментарии недоступны в большинстве случаев
            return {
                "comments_count": 0,
                "comment_texts": [],
                "has_comments": False,
                "texts_retrieved": 0
            }

        except Exception as e:
            print(f"Общая ошибка получения данных комментариев: {e}")
            return {
                "comments_count": 0,
                "comment_texts": [],
                "has_comments": False,
                "texts_retrieved": 0
            }

    async def get_comments_texts(self, message: Message, channel, limit: int = 10) -> list[str]:
        """Получение списка текстов первых N комментариев"""
        try:
            result = await self.client(GetDiscussionMessageRequest(
                peer=channel,
                msg_id=message.id
            ))

            if hasattr(result, "messages") and result.messages:
                comment_texts = []
                for comment in result.messages[:limit]:
                    if comment.message and comment.message.strip():
                        comment_texts.append(comment.message.strip())
                return comment_texts

            return []

        except Exception as e:
            print(f"Ошибка получения текстов комментариев: {e}")
            return []
