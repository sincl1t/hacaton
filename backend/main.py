from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
import os
import uuid

from .models import (
    ContentItem,
    SummaryStats,
    CompareRequest,
    ChatRequest,
    ChatResponse,
    AuthRequest,
    AuthResponse,
    UserProfile,
    UserProfileUpdateRequest,
)
from .services import (
    get_all_content,
    get_summary_stats,
    get_content_by_id,
    compare_items,
    ask_llm,
    create_user,
    authenticate_user,
    get_user_profile,
    update_user_profile,
    save_user_avatar,
    MEDIA_DIR,
)

app = FastAPI(title="Web/DA – Smart Content Registry API")

# CORS для фронта
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # на хакатоне можно так, потом сузите
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# статика для аватаров
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


@app.get("/api/stats/summary", response_model=SummaryStats)
def api_summary():
    return get_summary_stats()


@app.get("/api/content", response_model=List[ContentItem])
def api_content():
    return get_all_content()


@app.get("/api/content/{item_id}", response_model=ContentItem)
def api_content_item(item_id: int):
    item = get_content_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    return item


@app.post("/api/compare", response_model=List[ContentItem])
def api_compare(req: CompareRequest):
    return compare_items(req.ids)


@app.post("/api/chat", response_model=ChatResponse)
async def api_chat(req: ChatRequest):
    return await ask_llm(req.query)


# ---------- АВТОРИЗАЦИЯ ----------


@app.post("/api/auth/register", response_model=AuthResponse)
def api_register(req: AuthRequest):
    try:
        create_user(req.email, req.password)
        return AuthResponse(
            success=True,
            message="Пользователь успешно зарегистрирован",
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception:
        raise HTTPException(
            status_code=500,
            detail="Ошибка при регистрации пользователя",
        )


@app.post("/api/auth/login", response_model=AuthResponse)
def api_login(req: AuthRequest):
    user = authenticate_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Неверный email или пароль")

    return AuthResponse(
        success=True,
        message="Успешный вход",
    )


# ---------- ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ ----------


@app.get("/api/user/profile", response_model=UserProfile)
def api_user_profile(email: str):
    profile = get_user_profile(email)
    if not profile:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return profile


@app.put("/api/user/profile", response_model=UserProfile)
def api_update_profile(req: UserProfileUpdateRequest):
    profile = update_user_profile(
        email=req.email,
        username=req.username,
        role=req.role,
        bio=req.bio,
    )
    if not profile:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return profile


@app.post("/api/user/avatar", response_model=UserProfile)
async def api_upload_avatar(email: str, file: UploadFile = File(...)):
    # простая проверка расширения
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
        raise HTTPException(status_code=400, detail="Неподдерживаемый формат файла")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(MEDIA_DIR, filename)

    with open(filepath, "wb") as f:
        f.write(await file.read())

    profile = save_user_avatar(email, filename)
    if not profile:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return profile
