import React, { useState, useRef, useEffect } from "react";
import { postChat } from "../api";

export default function ChatBot() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text:
        "Привет! Я могу отвечать на вопросы по статистике контента в MWS Tables. " +
        "Спроси, например: «Какие публикации показали высокий охват, но низкую вовлечённость за последнюю неделю?»",
    },
  ]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // автоскролл вниз при новых сообщениях
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = () => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    postChat(trimmed)
      .then((res) => {
        const answerText =
          res?.data?.answer ?? "Не удалось получить ответ от LLM.";
        const assistantMessage = { role: "assistant", text: answerText };
        setMessages((prev) => [...prev, assistantMessage]);
      })
      .catch((error) => {
        console.error("Ошибка запроса к /api/chat:", error);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            text:
              "Кажется, backend сейчас недоступен. " +
              "Проверь, запущен ли сервер FastAPI на порту 8000.",
          },
        ]);
      })
      .finally(() => setLoading(false));
  };

  const handleKeyDown = (event) => {
    // Enter = отправить, Shift+Enter = новая строка
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div>
        <h1 style={{ fontSize: 20, marginBottom: 4 }}>Чат-бот (LLM)</h1>
        <p style={{ fontSize: 13, color: "#9da3b5", marginBottom: 0 }}>
          Задавай вопросы к статистике естественным языком — модель будет
          использовать данные из MWS Tables и возвращать понятные инсайты.
        </p>
      </div>

      {/* Окно диалога */}
      <div
        ref={chatRef}
        style={{
          flex: 1,
          minHeight: 260,
          maxHeight: 460,
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#05060a",
          padding: 12,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {messages.map((m, index) => (
          <div
            key={index}
            style={{
              alignSelf: m.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
            }}
          >
            <div
              style={{
                fontSize: 10,
                marginBottom: 4,
                color: "#9da3b5",
                textAlign: m.role === "user" ? "right" : "left",
              }}
            >
              {m.role === "user" ? "Вы" : "Web/DA · LLM"}
            </div>
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                fontSize: 13,
                lineHeight: 1.5,
                backgroundColor:
                  m.role === "user" ? "#d94e68" : "#0a0f18",
                border: m.role === "user" ? "none" : "1px solid #2b3040",
                color: "#ffffff",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div
            style={{
              alignSelf: "flex-start",
              padding: 10,
              borderRadius: 12,
              fontSize: 13,
              backgroundColor: "#0a0f18",
              border: "1px solid #2b3040",
              color: "#c2c6d0",
            }}
          >
            Думаю…
          </div>
        )}
      </div>

      {/* Панель ввода */}
      <div
        style={{
          borderRadius: 12,
          border: "1px solid #2b3040",
          backgroundColor: "#0a0f18",
          padding: 10,
          display: "flex",
          alignItems: "flex-end",
          gap: 8,
        }}
      >
        <textarea
          rows={2}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Напишите вопрос про контент, метрики, вовлечённость…"
          style={{
            flex: 1,
            resize: "none",
            padding: 8,
            borderRadius: 8,
            border: "1px solid #2b3040",
            backgroundColor: "#05060a",
            color: "#ffffff",
            fontSize: 13,
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleSend}
          disabled={loading || !query.trim()}
          style={{
            minWidth: 96,
            padding: "8px 12px",
            borderRadius: 999,
            border: "none",
            backgroundColor:
              loading || !query.trim() ? "#3a3f52" : "#d94e68",
            color: "#ffffff",
            fontSize: 13,
            cursor:
              loading || !query.trim() ? "default" : "pointer",
            transition:
              "background-color 0.15s ease-out, transform 0.1s ease-out",
          }}
          onMouseDown={(e) => {
            if (!loading && query.trim()) {
              e.currentTarget.style.transform = "scale(0.97)";
            }
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {loading ? "Отправляю…" : "Спросить"}
        </button>
      </div>
    </div>
  );
}
