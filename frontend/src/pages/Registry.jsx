import React, { useEffect, useState } from "react";
import { getContent } from "../api";

export default function Registry() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getContent().then((res) => setItems(res.data));
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1.2fr", gap: 16 }}>
      <div>
        <h1 style={{ fontSize: 20, marginBottom: 8 }}>Реестр контента</h1>
        <p style={{ fontSize: 13, color: "#9da3b5", marginBottom: 12 }}>
          Каждая строка — отдельная публикация с основными метриками.
        </p>
        <div
          style={{
            borderRadius: 12,
            border: "1px solid #2b3040",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse" }}>
            <thead style={{ backgroundColor: "#0a0f18" }}>
              <tr>
                <th style={{ padding: 8, textAlign: "left" }}>Платформа</th>
                <th style={{ padding: 8, textAlign: "left" }}>Заголовок</th>
                <th style={{ padding: 8, textAlign: "right" }}>Просмотры</th>
                <th style={{ padding: 8, textAlign: "right" }}>ER</th>
                <th style={{ padding: 8, textAlign: "right" }}>Sentiment</th>
              </tr>
            </thead>
            <tbody>
              {items.map((i) => (
                <tr
                  key={i.id}
                  onClick={() => setSelected(i)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      selected && selected.id === i.id ? "#181d2b" : "transparent",
                  }}
                >
                  <td style={{ padding: 8 }}>{i.platform}</td>
                  <td style={{ padding: 8 }}>{i.title}</td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {i.views.toLocaleString("ru-RU")}
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {(i.engagement_rate * 100).toFixed(1)}%
                  </td>
                  <td style={{ padding: 8, textAlign: "right" }}>
                    {i.sentiment.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: 16, marginBottom: 8 }}>Детали публикации</h2>
        {!selected && (
          <p style={{ fontSize: 13, color: "#9da3b5" }}>
            Выбери публикацию в таблице слева.
          </p>
        )}
        {selected && (
          <div
            style={{
              borderRadius: 12,
              border: "1px solid #2b3040",
              padding: 16,
              fontSize: 13,
              backgroundColor: "#0a0f18",
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              {selected.title}
            </div>
            <div style={{ marginBottom: 4, color: "#9da3b5" }}>
              {selected.platform} · {selected.author}
            </div>
            <a
              href={selected.url}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 12, color: "#c5e479" }}
            >
              Открыть публикацию
            </a>
            <div style={{ marginTop: 12 }}>
              <div>Просмотры: {selected.views.toLocaleString("ru-RU")}</div>
              <div>Лайки: {selected.likes.toLocaleString("ru-RU")}</div>
              <div>Комментарии: {selected.comments.toLocaleString("ru-RU")}</div>
              <div>
                Engagement: {(selected.engagement_rate * 100).toFixed(1)}%
              </div>
              <div>Sentiment: {selected.sentiment.toFixed(2)}</div>
              <div style={{ marginTop: 8 }}>
                Теги: {selected.tags.join(", ")}
              </div>
            </div>
            <div
              style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: "1px dashed #2b3040",
              }}
            >
              <div style={{ fontWeight: 500, marginBottom: 4 }}>
                Краткий разбор (заглушка LLM)
              </div>
              <p style={{ color: "#c2c6d0", lineHeight: 1.5 }}>
                Здесь модель будет объяснять, почему пост сработал (или нет):
                тема, время публикации, платформа, реакция аудитории. Пока это
                просто статичный текст.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
