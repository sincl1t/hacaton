import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Укажи email и пароль");
      return;
    }

    // имитация небольшой задержки, чтобы кнопка «Регистрируем...» мигнула
    setLoading(true);

    setTimeout(() => {
      // никаких запросов на бэкенд — просто считаем, что пользователь создан
      // и сохраняем его в AuthContext / localStorage
      login({ email: form.email });

      setLoading(false);
      navigate("/dashboard");
    }, 400);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Регистрация</h1>
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
            {loading ? "Регистрируем..." : "Создать аккаунт"}
          </button>
        </form>

        <p className="auth-switch">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
