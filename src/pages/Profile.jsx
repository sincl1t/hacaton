import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchProfile = async () => {
      try {
        const resp = await fetch(
          `${API_BASE}/api/user/profile?email=${encodeURIComponent(email)}`
        );
        if (!resp.ok) {
          throw new Error("Не удалось загрузить профиль");
        }
        const data = await resp.json();
        setProfile(data);
      } catch (e) {
        setError(e.message);
      }
    };

    fetchProfile();
  }, [email]);

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError("");

    try {
      const resp = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: profile.email,
          username: profile.username,
          role: profile.role,
          bio: profile.bio,
        }),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка сохранения профиля");
      }

      const data = await resp.json();
      setProfile(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !email) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const resp = await fetch(
        `${API_BASE}/api/user/avatar?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.detail || "Ошибка загрузки аватара");
      }

      const data = await resp.json();
      setProfile(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  if (!profile) {
    return <div className="profile-page-loading">Загрузка профиля...</div>;
  }

  const createdDate = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString()
    : "";

  return (
    <div className="profile-page">
      <div className="profile-left">
        <div className="profile-avatar-wrapper">
          {profile.avatar_url ? (
            <img
              src={`${API_BASE}${profile.avatar_url}`}
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
          {createdDate && (
            <div className="profile-created">
              На платформе с {createdDate}
            </div>
          )}
        </div>
      </div>

      <div className="profile-right">
        <h1 className="profile-title">Профиль</h1>

        {error && <div className="profile-error">{error}</div>}

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
              placeholder="Короткое описание, как на GitHub"
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
