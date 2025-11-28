import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  const email = user?.email;
  const storageKey = email ? `userProfile:${email}` : null;

  // загружаем профиль из localStorage или создаём дефолтный
  useEffect(() => {
    if (!email) {
      setError("Пользователь не авторизован");
      return;
    }

    try {
      const raw = storageKey ? localStorage.getItem(storageKey) : null;
      if (raw) {
        const data = JSON.parse(raw);
        setProfile(data);
      } else {
        const baseProfile = {
          email,
          username: email.split("@")[0],
          role: "user",
          bio: "",
          avatarDataUrl: null,
        };
        setProfile(baseProfile);
        if (storageKey) {
          localStorage.setItem(storageKey, JSON.stringify(baseProfile));
        }
      }
    } catch (e) {
      console.error("Profile load error:", e);
      setError("Не удалось загрузить профиль из localStorage");
    }
  }, [email, storageKey]);

  const syncToStorage = (data) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
    } catch (e) {
      console.error("Profile save error:", e);
      setError("Не удалось сохранить профиль в localStorage");
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, [field]: value };
      syncToStorage(updated);
      return updated;
    });
    setSavedMessage("");
  };

  const handleSave = () => {
    if (!profile) return;
    setSaving(true);
    setError("");
    try {
      syncToStorage(profile);
      setSavedMessage("Изменения сохранены");
    } catch (e) {
      setError("Не удалось сохранить изменения");
    } finally {
      setSaving(false);
      setTimeout(() => setSavedMessage(""), 2000);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => {
        if (!prev) return prev;
        const updated = { ...prev, avatarDataUrl: reader.result };
        syncToStorage(updated);
        return updated;
      });
      setUploading(false);
    };
    reader.onerror = () => {
      setError("Ошибка чтения файла");
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  if (!email) {
    return (
      <div className="profile-page">
        <div className="profile-right">
          <h1 className="profile-title">Профиль</h1>
          <div className="profile-error">
            Нет информации о пользователе. Попробуй выйти и войти снова.
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <div className="profile-page-loading">Загрузка профиля…</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-left">
        <div className="profile-avatar-wrapper">
          {profile.avatarDataUrl ? (
            <img
              src={profile.avatarDataUrl}
              alt={profile.username || profile.email}
              className="profile-avatar-img"
            />
          ) : (
            <div className="profile-avatar-placeholder">
              {(profile.username || profile.email || "?")[0]
                .toUpperCase()
                .trim()}
            </div>
          )}

          <label className="profile-avatar-upload-btn">
            {uploading ? "Загрузка..." : "Изменить аватар"}
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
            />
          </label>
        </div>

        <div className="profile-meta">
          <div className="profile-email">{profile.email}</div>
        </div>
      </div>

      <div className="profile-right">
        <h1 className="profile-title">Профиль</h1>

        {error && <div className="profile-error">{error}</div>}
        {savedMessage && !error && (
          <div className="profile-saved">{savedMessage}</div>
        )}

        <div className="profile-form">
          <div className="profile-field">
            <label>Имя пользователя</label>
            <input
              type="text"
              value={profile.username || ""}
              onChange={handleChange("username")}
              placeholder="Как на GitHub"
            />
          </div>

          <div className="profile-field">
            <label>Роль</label>
            <select
              value={profile.role || "user"}
              onChange={handleChange("role")}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>

          <div className="profile-field">
            <label>Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={handleChange("bio")}
              rows={5}
              placeholder="Расскажите о себе"
            />
          </div>

          <div className="profile-actions">
            <button
              onClick={handleSave}
              disabled={saving}
              className="profile-save-btn"
            >
              {saving ? "Сохраняем..." : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
