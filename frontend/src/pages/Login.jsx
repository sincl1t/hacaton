import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as loginApi } from "../api";
import contentHubLogo from "../assets/icons/contenthub-logo.png";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginApi(form.email, form.password);
      login({ email: form.email });
      navigate("/dashboard");
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        "Ошибка входа. Проверь email и пароль.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Хедер карточки */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
            gap: 16,
          }}
        >
          <h1 style={{ margin: 0, flexShrink: 0 }}>Вход</h1>

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
                alt="ContentHub logo"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                lineHeight: 1.1,
              }}
            >
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
                  marginTop: 2,
                  whiteSpace: "nowrap",
                }}
              >
                Реестр контента
              </span>
            </div>
          </div>
        </div>

        {/* Форма входа */}
        <form onSubmit={handleSubmit}>
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

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" disabled={loading}>
            {loading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="auth-switch">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
