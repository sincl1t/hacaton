import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { register as registerApi } from "../api";
import contentHubLogo from "../assets/icons/contenthub-logo.png";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    bio: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [error, setError] = useState("");
  const [passwordHint, setPasswordHint] = useState("");
  const [loading, setLoading] = useState(false);

  const MIN_PASSWORD_LENGTH = 6;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordHint(
        value.length > 0 && value.length < MIN_PASSWORD_LENGTH
          ? `Пароль должен быть не короче ${MIN_PASSWORD_LENGTH} символов`
          : ""
      );
    }
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatar(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    try {
      setLoading(true);

      if (avatar) formData.append("avatar", avatar);

      await registerApi(form.email, form.password);

      login({ email: form.email });
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Не удалось зарегистрироваться.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Хедер */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            gap: 16,
          }}
        >
          <h1 style={{ margin: 0, flexShrink: 0 }}>Регистрация</h1>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexShrink: 1,
              maxWidth: "60%",
              paddingTop: 6,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "#080d15",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={contentHubLogo}
                alt="logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <span
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                GrandContentHub
              </span>
              <span
                style={{
                  color: "#9da3b5",
                  fontSize: 13,
                  whiteSpace: "nowrap",
                }}
              >
                ContentHub – Реестр контента
              </span>
            </div>
          </div>
        </div>

        {/* Форма */}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          {/* Password */}
          <label>
            Пароль
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Подтверждение пароля
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
          </label>

          {/* Role */}
          <label>
            Роль
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              style={{
                background: "#000317",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 12px",
                border: "1px solid #1a1f2d",
              }}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
            </select>
          </label>

          {/* Bio */}
          <label>
            Био
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              maxLength={200}
              placeholder="Расскажи о себе…"
              style={{
                background: "#000317",
                color: "#fff",
                borderRadius: 8,
                padding: "10px 12px",
                minHeight: 80,
                resize: "none",
                border: "1px solid #1a1f2d",
              }}
            />
          </label>

          {/* Avatar */}
          <label>
            Аватар
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 6,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: "#000317",
                  border: "1px solid #1a1f2d",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ color: "#666" }}>фото</span>
                )}
              </div>

              <div
                style={{
                  background: "#000317",
                  borderRadius: 8,
                  padding: "10px 12px",
                  border: "1px solid #1a1f2d",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  style={{
                    color: "#fff",
                  }}
                />
              </div>
            </div>
          </label>

          {passwordHint && !error && (
            <div className="auth-hint">{passwordHint}</div>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Создаём..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт?{" "}
          <Link to="/login" style={{ color: "#d94f69" }}>
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
