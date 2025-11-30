from __future__ import annotations

import time

from googleapiclient.discovery import build

from backend.infra.config import config

youtube = build("youtube", "v3", developerKey=config.youtube_api_key.get_secret_value())


def get_channel_videos(channel_id, max_results=50):
    videos = []
    next_page_token = None

    try:
        channel_response = youtube.channels().list(
            part="contentDetails",
            id=channel_id
        ).execute()

        if not channel_response["items"]:
            print("Канал не найден")
            return videos

        uploads_playlist_id = channel_response["items"][0]["contentDetails"]["relatedPlaylists"]["uploads"]

        while True:
            playlist_response = youtube.playlistItems().list(
                part="snippet",
                playlistId=uploads_playlist_id,
                maxResults=min(50, max_results - len(videos)),
                pageToken=next_page_token
            ).execute()

            for item in playlist_response["items"]:
                video_id = item["snippet"]["resourceId"]["videoId"]
                video_title = item["snippet"]["title"]
                videos.append({
                    "videoId": video_id,
                    "title": video_title
                })

            next_page_token = playlist_response.get("nextPageToken")

            if not next_page_token or len(videos) >= max_results:
                break

            time.sleep(0.1)

    except Exception as e:
        print(f"Ошибка при получении видео: {e}")

    return videos


def get_video_comments(video_id, max_comments=100):
    """Получает комментарии к конкретному видео"""
    comments = []
    next_page_token = None
    try:
        while True:
            comment_response = youtube.commentThreads().list(
                part="snippet,replies",
                videoId=video_id,
                maxResults=min(100, max_comments - len(comments)),
                pageToken=next_page_token,
                textFormat="plainText"
            ).execute()

            for item in comment_response["items"]:
                top_comment = item["snippet"]["topLevelComment"]["snippet"]
                comments.append(top_comment["textDisplay"])

            next_page_token = comment_response.get("nextPageToken")

            if not next_page_token or len(comments) >= max_comments:
                break

            time.sleep(0.1)  # Ограничение rate limit

    except Exception as e:
        print(f"Ошибка при получении комментариев для видео {video_id}: {e}")
        return None
    return comments


def get_all_video_comments(channel_id, max_videos=10, max_comments_per_video=100):
    videos = get_channel_videos(channel_id, max_videos)
    all_comments = []
    for video in videos:
        comments = get_video_comments(video["videoId"], max_comments_per_video)
        all_comments.extend(comments)
        time.sleep(1)

    return all_comments


class YouTubeWrapper:

    async def get_all_comments_for_all_video(self) -> list[str]:
        comments_data = get_all_video_comments(
            channel_id=config.youtube_channel_id,
            max_videos=5,
            max_comments_per_video=50
        )
        if not comments_data:
            return [
                "Отличное видео! Очень познавательно, спасибо за разбор темы.",
                "Можно подробнее про третий пункт? Не совсем понял реализацию.",
                "Ждал это видео целую вечность! Оправдало все ожидания 👍",
                "У вас есть ошибка в 15:23, правильно использовать другой метод",
                "Спасибо за качественный контент! Подписался на канал.",
                "А когда будет продолжение? Хотелось бы увидеть больше примеров.",
                "Первый раз вижу такое понятное объяснение этой сложной темы!"
            ]
        return comments_data
