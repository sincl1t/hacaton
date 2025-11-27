from datetime import datetime, timedelta

NOW = datetime.utcnow()

CONTENT_ITEMS = [
    {
        "id": 1,
        "platform": "YouTube",
        "title": "Как мы запустили умный реестр контента",
        "url": "https://example.com/youtube/1",
        "author": "Marketing Team",
        "published_at": (NOW - timedelta(days=3)).isoformat(),
        "views": 15230,
        "likes": 1230,
        "comments": 210,
        "engagement_rate": 0.095,
        "sentiment": 0.72,
        "tags": ["webda", "case", "analytics"],
        "status": "active",
    },
    {
        "id": 2,
        "platform": "Telegram",
        "title": "Боль контент-менеджера: ручная статистика",
        "url": "https://t.me/example/2",
        "author": "SMM",
        "published_at": (NOW - timedelta(days=5)).isoformat(),
        "views": 8900,
        "likes": 430,
        "comments": 95,
        "engagement_rate": 0.059,
        "sentiment": 0.35,
        "tags": ["pain", "manual"],
        "status": "active",
    },
]
